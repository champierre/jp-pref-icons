const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');
const turf = require('@turf/turf');
const { NAMES_JA, ROMAJI } = require('./prefectures');
const puppeteer = require('puppeteer');
const https = require('https');

class PrefectureIconGenerator {
  constructor(options = {}) {
    this.options = {
      size: options.size || 256,
      lineWidth: options.lineWidth || 0.5,
      faceColor: options.faceColor || '#0E7A6F',
      edgeColor: options.edgeColor || '#0A5A52',
      textColor: options.textColor || '#FFFFFF',
      textSize: options.textSize || 0.12,
      outputDir: options.outputDir || 'icons',
      generateSVG: options.generateSVG || false,
      padding: options.padding || 0.07,
      targetPrefectures: options.targetPrefectures || null,
      showText: options.showText === undefined ? true : options.showText // Default to true unless explicitly set to false
    };
    
    // Parse target prefectures if specified
    if (this.options.targetPrefectures) {
      this.targetPrefectures = this.parseTargetPrefectures(this.options.targetPrefectures);
    }
  }
  
  parseTargetPrefectures(input) {
    const targets = new Set();
    const items = input.split(',').map(item => item.trim());
    
    items.forEach(item => {
      // Check if it's a number (prefecture code)
      const code = parseInt(item);
      if (!isNaN(code) && code >= 1 && code <= 47) {
        targets.add(code);
      } else {
        // Try to match by Japanese name
        const matchedCode = Object.entries(NAMES_JA).find(([, v]) => v === item)?.[0];
        if (matchedCode) {
          targets.add(parseInt(matchedCode));
        } else {
          // Try to match by Romaji name (case-insensitive)
          const romajiMatch = Object.entries(ROMAJI).find(([, v]) => 
            v.toLowerCase() === item.toLowerCase()
          )?.[0];
          if (romajiMatch) {
            targets.add(parseInt(romajiMatch));
          } else {
            console.warn(`Warning: Could not find prefecture: ${item}`);
          }
        }
      }
    });
    
    return targets.size > 0 ? targets : null;
  }

  async loadGeoJSON(filePath) {
    const data = await fs.readJson(filePath);
    return data;
  }

  findColumns(features) {
    if (!features || features.length === 0) return { codeCol: null, nameCol: null };
    
    const sample = features[0].properties;
    const codeColumns = ['code', 'pref_code', 'jiscode', 'PREF_CODE', 'PREF'];
    const nameColumns = ['nam_ja', 'name_ja', 'NAME_JA', 'name', 'NAME', 'pref_name', 'P'];
    
    const codeCol = codeColumns.find(col => col in sample) || null;
    const nameCol = nameColumns.find(col => col in sample) || null;
    
    return { codeCol, nameCol };
  }

  groupByPrefecture(features, codeCol, nameCol) {
    const groups = {};
    
    features.forEach(feature => {
      let key;
      if (codeCol) {
        key = parseInt(feature.properties[codeCol]);
      } else if (nameCol) {
        const name = feature.properties[nameCol];
        // Try to find code from name
        const code = Object.entries(NAMES_JA).find(([, v]) => v === name)?.[0];
        key = code ? parseInt(code) : name;
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(feature);
    });
    
    return groups;
  }

  getSquareExtent(bbox, padding) {
    const [minX, minY, maxX, maxY] = bbox;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const r = Math.max(maxX - minX, maxY - minY) * (0.5 + padding);
    return [cx - r, cy - r, cx + r, cy + r];  // [minX, minY, maxX, maxY] format
  }

  projectToCanvas(coords, extent, size) {
    const [minX, minY, maxX, maxY] = extent;  // Fixed order to match getSquareExtent
    const width = maxX - minX;
    const height = maxY - minY;
    
    const x = ((coords[0] - minX) / width) * size;
    const y = size - ((coords[1] - minY) / height) * size; // Flip Y axis
    
    return [x, y];
  }

  filterTokyoMainland(features) {
    if (features.length === 0) return features;
    
    // If there's only one feature, it's likely a MultiPolygon containing all Tokyo parts
    if (features.length === 1) {
      const feature = features[0];
      if (feature.geometry.type === 'MultiPolygon') {
        // Extract individual polygons from MultiPolygon
        const polygons = feature.geometry.coordinates.map((coords, index) => ({
          type: 'Feature',
          properties: { ...feature.properties, polygon_index: index },
          geometry: {
            type: 'Polygon',
            coordinates: coords
          }
        }));
        
        return this.filterTokyoMainlandPolygons(polygons);
      }
    }
    
    // If multiple features, process them directly
    return this.filterTokyoMainlandPolygons(features);
  }
  
  filterTokyoMainlandPolygons(polygons) {
    // Calculate area and centroid for each polygon
    const polygonsWithInfo = polygons.map((polygon, index) => {
      const area = turf.area(polygon);
      const centroid = turf.centroid(polygon);
      const [longitude, latitude] = centroid.geometry.coordinates;
      return { polygon, area, centroid, longitude, latitude, index };
    });

    // Sort by area (largest first)
    polygonsWithInfo.sort((a, b) => b.area - a.area);

    console.log(`  Analyzing ${polygonsWithInfo.length} Tokyo polygons:`);
    polygonsWithInfo.slice(0, 10).forEach((p, i) => {
      console.log(`    Polygon ${i}: lon=${p.longitude.toFixed(3)}, lat=${p.latitude.toFixed(3)}, area=${p.area.toFixed(0)}`);
    });

    // Tokyo mainland bounds (23 special wards + Tama area):
    // Longitude: 139.0° - 139.9°E (excluding Izu Islands and Ogasawara)
    // Latitude: 35.5° - 35.9°N (main Tokyo metropolitan area)
    const mainlandBounds = {
      minLon: 139.0,
      maxLon: 139.9,
      minLat: 35.5,
      maxLat: 35.9
    };

    // Filter polygons within mainland bounds
    const mainlandPolygons = polygonsWithInfo.filter(({ longitude, latitude }) => {
      return longitude >= mainlandBounds.minLon && 
             longitude <= mainlandBounds.maxLon &&
             latitude >= mainlandBounds.minLat && 
             latitude <= mainlandBounds.maxLat;
    });

    if (mainlandPolygons.length === 0) {
      console.log('  Warning: No mainland polygons found, using largest polygon');
      return [polygonsWithInfo[0].polygon];
    }

    console.log(`  Tokyo mainland filter: ${polygonsWithInfo.length} -> ${mainlandPolygons.length} polygons (excluded islands)`);
    
    // Create a new MultiPolygon feature with only mainland polygons
    if (mainlandPolygons.length === 1) {
      return [mainlandPolygons[0].polygon];
    } else {
      // Combine multiple mainland polygons into one MultiPolygon feature
      const combinedFeature = {
        type: 'Feature',
        properties: polygons[0].properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: mainlandPolygons.map(p => p.polygon.geometry.coordinates)
        }
      };
      return [combinedFeature];
    }
  }

  filterKagoshimaMainland(features) {
    if (features.length === 0) return features;
    
    // If there's only one feature, it's likely a MultiPolygon containing all Kagoshima parts
    if (features.length === 1) {
      const feature = features[0];
      if (feature.geometry.type === 'MultiPolygon') {
        // Extract individual polygons from MultiPolygon
        const polygons = feature.geometry.coordinates.map((coords, index) => ({
          type: 'Feature',
          properties: { ...feature.properties, polygon_index: index },
          geometry: {
            type: 'Polygon',
            coordinates: coords
          }
        }));
        
        return this.filterKagoshimaMainlandPolygons(polygons);
      }
    }
    
    // If multiple features, process them directly
    return this.filterKagoshimaMainlandPolygons(features);
  }
  
  filterKagoshimaMainlandPolygons(polygons) {
    // Calculate area and centroid for each polygon
    const polygonsWithInfo = polygons.map((polygon, index) => {
      const area = turf.area(polygon);
      const centroid = turf.centroid(polygon);
      const [longitude, latitude] = centroid.geometry.coordinates;
      return { polygon, area, centroid, longitude, latitude, index };
    });

    // Sort by area (largest first)
    polygonsWithInfo.sort((a, b) => b.area - a.area);

    console.log(`  Analyzing ${polygonsWithInfo.length} Kagoshima polygons:`);
    polygonsWithInfo.slice(0, 10).forEach((p, i) => {
      console.log(`    Polygon ${i}: lon=${p.longitude.toFixed(3)}, lat=${p.latitude.toFixed(3)}, area=${p.area.toFixed(0)}`);
    });

    // Kagoshima mainland bounds (Satsuma and Osumi peninsulas):
    // Longitude: 129.4° - 131.5°E (excluding distant islands like Amami, Yakushima, Tanegashima)
    // Latitude: 30.8° - 32.2°N (main Kyushu part of Kagoshima)
    const mainlandBounds = {
      minLon: 129.4,
      maxLon: 131.5,
      minLat: 30.8,
      maxLat: 32.2
    };

    // Filter polygons within mainland bounds
    const mainlandPolygons = polygonsWithInfo.filter(({ longitude, latitude }) => {
      return longitude >= mainlandBounds.minLon && 
             longitude <= mainlandBounds.maxLon &&
             latitude >= mainlandBounds.minLat && 
             latitude <= mainlandBounds.maxLat;
    });

    if (mainlandPolygons.length === 0) {
      console.log('  Warning: No mainland polygons found, using largest polygon');
      return [polygonsWithInfo[0].polygon];
    }

    console.log(`  Kagoshima mainland filter: ${polygonsWithInfo.length} -> ${mainlandPolygons.length} polygons (excluded islands)`);
    
    // Create a new MultiPolygon feature with only mainland polygons
    if (mainlandPolygons.length === 1) {
      return [mainlandPolygons[0].polygon];
    } else {
      // Combine multiple mainland polygons into one MultiPolygon feature
      const combinedFeature = {
        type: 'Feature',
        properties: polygons[0].properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: mainlandPolygons.map(p => p.polygon.geometry.coordinates)
        }
      };
      return [combinedFeature];
    }
  }


  drawPolygonPath(ctx, coordinates, extent, size) {
    // Draw polygon path without beginPath/closePath
    const drawRing = (ring) => {
      ring.forEach((coord, i) => {
        const [x, y] = this.projectToCanvas(coord, extent, size);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
    };

    if (coordinates[0] && coordinates[0][0] && Array.isArray(coordinates[0][0])) {
      // Polygon format
      drawRing(coordinates[0]);
    }
  }

  async generateIcon(features, prefCode, prefName, romaji) {
    const size = this.options.size;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Special handling for Tokyo (code 13) and Kagoshima (code 46) - exclude islands
    let featuresToProcess = features;
    if (prefCode === 13) {
      featuresToProcess = this.filterTokyoMainland(features);
      console.log(`  Filtered Tokyo: ${features.length} features -> ${featuresToProcess.length} mainland features`);
    } else if (prefCode === 46) {
      featuresToProcess = this.filterKagoshimaMainland(features);
      console.log(`  Filtered Kagoshima: ${features.length} features -> ${featuresToProcess.length} mainland features`);
    }

    // Combine all geometries
    let combined;
    if (featuresToProcess.length === 1) {
      combined = featuresToProcess[0];
    } else {
      // Union all features
      combined = featuresToProcess[0];
      for (let i = 1; i < featuresToProcess.length; i++) {
        try {
          combined = turf.union(combined, featuresToProcess[i]);
        } catch (e) {
          // If union fails, just use the first feature
          console.warn(`Warning: Could not union features for ${prefName}`);
        }
      }
    }

    // Get bounding box
    const bbox = turf.bbox(combined);
    const extent = this.getSquareExtent(bbox, this.options.padding);

    // Set background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Set explicit fill and stroke styles
    ctx.fillStyle = this.options.faceColor;
    ctx.strokeStyle = this.options.edgeColor;
    ctx.lineWidth = this.options.lineWidth * (size / 100);
    ctx.globalCompositeOperation = 'source-over';

    // Draw based on geometry type
    const geom = combined.geometry;
    
    if (geom.type === 'Polygon') {
      ctx.beginPath();
      this.drawPolygonPath(ctx, geom.coordinates, extent, size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (geom.type === 'MultiPolygon') {
      // Draw all polygons
      geom.coordinates.forEach(polygon => {
        ctx.beginPath();
        this.drawPolygonPath(ctx, polygon, extent, size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }

    // Draw text (if enabled)
    if (this.options.showText) {
      const center = turf.center(combined);
      const [cx, cy] = this.projectToCanvas(center.geometry.coordinates, extent, size);
      
      // Reset shadow settings from previous drawing
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Set text properties
      ctx.font = `bold ${size * this.options.textSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw text stroke (outline) first
      ctx.strokeStyle = this.options.edgeColor;
      ctx.lineWidth = size * 0.015; // Outline thickness relative to icon size (increased for better visibility)
      ctx.strokeText(prefName, cx, cy);
      
      // Draw text fill on top of stroke
      ctx.fillStyle = this.options.textColor;
      ctx.fillText(prefName, cx, cy);
    }

    // Generate file name and ensure output directory
    const fileName = prefCode ? `${String(prefCode).padStart(2, '0')}_${romaji}` : romaji;
    const pngPath = path.join(this.options.outputDir, `${fileName}.png`);
    
    await fs.ensureDir(this.options.outputDir);

    // Generate SVG first, then convert to PNG using Puppeteer
    const svgPath = await this.generateSVG(combined, extent, prefName, fileName);
    
    // Convert SVG to PNG using Puppeteer
    await this.convertSvgToPng(svgPath, pngPath, size);
    
    // Remove SVG if not requested
    if (!this.options.generateSVG) {
      await fs.remove(svgPath);
    }

    return pngPath;
  }

  async generateSVG(feature, extent, prefName, fileName) {
    const size = this.options.size;
    const [minX, minY, maxX, maxY] = extent;  // Fixed order
    const width = maxX - minX;
    const height = maxY - minY;

    // Convert coordinates to SVG path
    const coordsToPath = (coords) => {
      return coords.map((point, i) => {
        const x = ((point[0] - minX) / width) * size;
        const y = size - ((point[1] - minY) / height) * size;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ') + ' Z';
    };

    let pathData = '';
    const geom = feature.geometry;
    if (geom.type === 'Polygon') {
      pathData = coordsToPath(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      pathData = geom.coordinates.map(polygon => coordsToPath(polygon[0])).join(' ');
    }

    const center = turf.center(feature);
    const [cx, cy] = this.projectToCanvas(center.geometry.coordinates, extent, size);

    // Generate text element only if showText is enabled
    const textElement = this.options.showText ? `
  <text x="${cx}" y="${cy}" fill="${this.options.textColor}" stroke="${this.options.edgeColor}" stroke-width="${size * 0.002}" font-size="${size * this.options.textSize}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">
    ${prefName}
  </text>` : '';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" fill="${this.options.faceColor}" stroke="${this.options.edgeColor}" stroke-width="${this.options.lineWidth * (size / 100)}" />${textElement}
</svg>`;

    const svgPath = path.join(this.options.outputDir, `${fileName}.svg`);
    await fs.writeFile(svgPath, svg);
    return svgPath;
  }

  async convertSvgToPng(svgPath, pngPath, size) {
    try {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      
      // Set viewport size
      await page.setViewport({ width: size, height: size });
      
      // Read SVG content
      const svgContent = await fs.readFile(svgPath, 'utf8');
      
      // Create HTML with SVG and transparent background
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background: transparent; }
            svg { display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
        </html>
      `;
      
      // Set HTML content
      await page.setContent(html);
      
      // Take screenshot with transparent background
      await page.screenshot({
        path: pngPath,
        type: 'png',
        omitBackground: true,
        clip: { x: 0, y: 0, width: size, height: size }
      });
      
      await browser.close();
      console.log(`  Converted SVG to PNG: ${path.basename(pngPath)}`);
      return pngPath;
    } catch (error) {
      console.error(`Error converting SVG to PNG: ${error.message}`);
      throw error;
    }
  }

  async downloadGeoJSONToMemory(url) {
    console.log(`Downloading GeoJSON from: ${url}`);
    
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            try {
              const geoJson = JSON.parse(data);
              console.log(`Downloaded GeoJSON data (${Math.round(data.length / 1024)}KB)`);
              resolve(geoJson);
            } catch (error) {
              reject(new Error(`Failed to parse JSON: ${error.message}`));
            }
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirects
          this.downloadGeoJSONToMemory(response.headers.location)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        }
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async ensureGeoJSONData() {
    // Official source: dataofjapan/land repository (based on 国土地理院 data)
    const sourceUrl = 'https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson';
    
    try {
      return await this.downloadGeoJSONToMemory(sourceUrl);
    } catch (error) {
      console.error('Failed to download official data:', error.message);
      
      // Fallback to alternative source
      console.log('Trying alternative source...');
      const fallbackUrl = 'https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/prefecture.geojson';
      
      try {
        return await this.downloadGeoJSONToMemory(fallbackUrl);
      } catch (fallbackError) {
        throw new Error(`Failed to download GeoJSON data: ${fallbackError.message}`);
      }
    }
  }

  async generate(geoJsonPath = null) {
    let data;
    
    // If no path provided, download official data to memory
    if (!geoJsonPath) {
      console.log('Loading GeoJSON data...');
      data = await this.ensureGeoJSONData();
    } else {
      // Load from file path
      console.log('Loading GeoJSON data...');
      data = await this.loadGeoJSON(geoJsonPath);
    }
    
    const features = data.features;

    const { codeCol, nameCol } = this.findColumns(features);
    
    if (!codeCol && !nameCol) {
      throw new Error('Could not find prefecture code or name column in GeoJSON');
    }

    console.log(`Found columns - Code: ${codeCol}, Name: ${nameCol}`);
    
    const groups = this.groupByPrefecture(features, codeCol, nameCol);
    const keys = Object.keys(groups).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.localeCompare(b);
    });

    // Filter prefectures if targets are specified
    let filteredKeys = keys;
    if (this.targetPrefectures) {
      filteredKeys = keys.filter(key => {
        const code = parseInt(key);
        if (!isNaN(code)) {
          return this.targetPrefectures.has(code);
        } else {
          // Try to match by name
          const matchedCode = Object.entries(NAMES_JA).find(([, v]) => v === key)?.[0];
          return matchedCode && this.targetPrefectures.has(parseInt(matchedCode));
        }
      });
      
      if (filteredKeys.length === 0) {
        console.log('No matching prefectures found for the specified targets.');
        return;
      }
      
      console.log(`Generating icons for ${filteredKeys.length} specified prefecture(s)...`);
    } else {
      console.log(`Generating icons for ${filteredKeys.length} prefectures...`);
    }

    for (const key of filteredKeys) {
      const features = groups[key];
      let code, japaneseName, romajiName;

      if (!isNaN(parseInt(key))) {
        code = parseInt(key);
        japaneseName = NAMES_JA[code] || `Prefecture ${code}`;
        romajiName = ROMAJI[code] || `Pref${String(code).padStart(2, '0')}`;
      } else {
        japaneseName = key;
        code = Object.entries(NAMES_JA).find(([, v]) => v === key)?.[0];
        romajiName = code ? ROMAJI[code] : 'Unknown';
        code = code ? parseInt(code) : 0;
      }

      console.log(`  Generating: ${japaneseName} (${romajiName})`);
      await this.generateIcon(features, code, japaneseName, romajiName);
    }

    console.log(`Done! Icons saved to ${this.options.outputDir}/`);
  }
}

module.exports = PrefectureIconGenerator;