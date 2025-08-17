#!/usr/bin/env node

const { program } = require('commander');
const PrefectureIconGenerator = require('../src/index');
const path = require('path');
const fs = require('fs-extra');

program
  .name('jp-pref-icons')
  .description('Generate icon images for Japanese prefectures from GeoJSON data')
  .version('1.0.0')
  .option('--geojson <path>', 'Path to prefectures GeoJSON file (if not provided, downloads official data)')
  .option('--out <dir>', 'Output directory', path.join(process.cwd(), 'icons'))
  .option('--size <number>', 'Icon size in pixels (square)', parseInt, 256)
  .option('--lw <number>', 'Line width', parseFloat, 0.5)
  .option('--face <color>', 'Face color', '#0E7A6F')
  .option('--edge <color>', 'Edge color', '#0A5A52')
  .option('--text <color>', 'Text color', '#FFFFFF')
  .option('--svg', 'Also generate SVG files')
  .option('--prefecture <names>', 'Generate only specified prefectures (comma-separated names or codes)')
  .option('--hide-text', 'Generate icons without prefecture name text')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    let geoJsonPath = null;
    
    // Check if custom GeoJSON path is provided
    if (options.geojson) {
      geoJsonPath = path.resolve(options.geojson);
      
      // Check if the file exists
      if (!await fs.pathExists(geoJsonPath)) {
        console.error(`Error: GeoJSON file not found: ${geoJsonPath}`);
        process.exit(1);
      }
    }

    const generator = new PrefectureIconGenerator({
      size: options.size,
      lineWidth: options.lw,
      faceColor: options.face,
      edgeColor: options.edge,
      textColor: options.text,
      outputDir: options.out,
      generateSVG: options.svg,
      targetPrefectures: options.prefecture,
      showText: !options.hideText
    });

    await generator.generate(geoJsonPath);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();