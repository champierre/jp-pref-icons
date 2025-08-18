# jp-pref-icons

Generate beautiful icon images for Japanese prefectures with Japanese prefecture boundary data. This tool automatically downloads the latest boundary data and creates high-quality PNG icons with optional SVG output.

[![npm version](https://badge.fury.io/js/jp-pref-icons.svg)](https://www.npmjs.com/package/jp-pref-icons)
[![GitHub Release](https://img.shields.io/github/v/release/champierre/jp-pref-icons)](https://github.com/champierre/jp-pref-icons/releases)

> 📖 **日本語ドキュメント**: [README_JP.md](README_JP.md) | 📋 **[Release Notes](https://github.com/champierre/jp-pref-icons/releases)**

## Features

- 🗾 **Prefecture Data**: Automatically downloads prefecture boundaries from data sources
- 🎨 **Customizable**: Adjustable colors, sizes, and border styles
- 🌍 **Smart Filtering**: Tokyo shows mainland only (excludes distant islands for better visibility)
- 🔤 **Flexible Text**: Show or hide prefecture names on icons
- 📁 **Multiple Formats**: PNG and SVG output with transparent backgrounds
- 🎯 **Selective Generation**: Generate specific prefectures by name or code
- 🖥️ **Easy CLI**: Simple command-line interface

## Sample Icons

Here are some examples of generated prefecture icons:

### Default Style

| Prefecture | Icon | Features |
|------------|------|----------|
| Tokyo (東京都) | ![Tokyo Icon](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/13_Tokyo.png) | Mainland filtering (excludes distant islands) |
| Osaka (大阪府) | ![Osaka Icon](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/27_Osaka.png) | Compact urban prefecture shape |
| Hokkaido (北海道) | ![Hokkaido Icon](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/01_Hokkaido.png) | Japan's largest prefecture |

### Text-Free Versions

| Prefecture | Icon | Command |
|------------|------|---------|
| Tokyo | ![Tokyo No Text](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/13_Tokyo_no_text.png) | `--prefecture "東京都" --hide-text` |

### Custom Color Schemes

| Prefecture | Icon | Command |
|------------|------|---------|
| Osaka (Red) | ![Osaka Red](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/27_Osaka_red.png) | `--prefecture "大阪府" --face "#FF6B6B" --edge "#D63031"` |
| Hokkaido (Blue) | ![Hokkaido Blue](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/01_Hokkaido_blue.png) | `--prefecture "北海道" --face "#74B9FF" --edge "#0984E3"` |

All icons feature:
- Clean, professional appearance with subtle text stroke outline
- Transparent backgrounds for versatile use
- Customizable color schemes and text options
- High-quality anti-aliased rendering

## Installation

### NPX (Recommended - No installation required)

```bash
# Generate all prefecture icons in current directory
npx jp-pref-icons

# Generate specific prefecture
npx jp-pref-icons --prefecture "東京都"

# Generate without text labels
npx jp-pref-icons --prefecture "東京都" --hide-text

# Custom styling
npx jp-pref-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### Local Installation

```bash
npm install jp-pref-icons
```

## Quick Start

### Using NPX (No installation required)

```bash
# Generate all prefectures (downloads data automatically)
npx jp-pref-icons

# Generate specific prefecture
npx jp-pref-icons --prefecture "東京都"

# Generate without text labels  
npx jp-pref-icons --prefecture "東京都" --hide-text

# Custom styling
npx jp-pref-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### Using Local Installation

```bash
# Generate all prefectures (downloads data automatically)
node bin/cli.js

# Generate specific prefecture
node bin/cli.js --prefecture "東京都"

# Generate without text labels
node bin/cli.js --prefecture "東京都" --hide-text

# Custom styling
node bin/cli.js --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

## Usage Examples

### Basic Usage

```bash
# Generate all 47 prefectures
npx jp-pref-icons

# Use custom GeoJSON file
npx jp-pref-icons --geojson custom-prefectures.geojson
```

### Generate Specific Prefectures

```bash
# Single prefecture by name
npx jp-pref-icons --prefecture "東京都"

# Multiple prefectures by name
npx jp-pref-icons --prefecture "東京都,大阪府,神奈川県"

# By prefecture codes
npx jp-pref-icons --prefecture "13,27,14"

# Mixed names and codes
npx jp-pref-icons --prefecture "13,大阪府,Tokyo"
```

### Styling Options

```bash
# Thin borders
npx jp-pref-icons --prefecture "東京都" --lw 0.5

# No text labels
npx jp-pref-icons --prefecture "東京都" --hide-text

# Custom colors
npx jp-pref-icons --prefecture "東京都" --face "#2E8B57" --edge "#1C5F3F" --text "#FFFFFF"

# Large size with SVG
npx jp-pref-icons --prefecture "東京都" --size 2048 --svg
```

### Programmatic Usage

```javascript
const PrefectureIconGenerator = require('./src/index');

const generator = new PrefectureIconGenerator({
  size: 256,                     // Icon size in pixels
  lineWidth: 0.5,               // Border line width
  faceColor: '#0E7A6F',         // Fill color
  edgeColor: '#0A5A52',         // Border color
  textColor: '#FFFFFF',         // Text color
  outputDir: 'icons',           // Output directory
  generateSVG: false,           // Also generate SVG files
  showText: true,               // Show prefecture names
  targetPrefectures: '東京都,大阪府' // Specific prefectures
});

// Generate icons (downloads data automatically)
generator.generate()
  .then(() => console.log('Icons generated successfully!'))
  .catch(err => console.error('Error:', err));

// Or use custom GeoJSON
generator.generate('custom-prefectures.geojson')
  .then(() => console.log('Icons generated!'));
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--geojson <path>` | Path to custom GeoJSON file (optional) | Auto-download |
| `--out <dir>` | Output directory | `icons` |
| `--size <number>` | Icon size in pixels (square) | `256` |
| `--lw <number>` | Line width | `0.5` |
| `--face <color>` | Face/fill color | `#0E7A6F` |
| `--edge <color>` | Edge/border color | `#0A5A52` |
| `--text <color>` | Text color | `#FFFFFF` |
| `--svg` | Also generate SVG files | `false` |
| `--prefecture <names>` | Generate only specified prefectures | All |
| `--hide-text` | Generate icons without text labels | `false` |
| `-h, --help` | Display help for command | - |
| `-V, --version` | Output the version number | - |

## Output Format

Icons are saved with the following naming convention:
- `{prefecture_code}_{romanized_name}.png` (e.g., `13_Tokyo.png`, `27_Osaka.png`)

## Data Sources

The tool automatically downloads Japanese prefecture boundary data from:

- [`dataofjapan/land`](https://github.com/dataofjapan/land) repository - japan.geojson (converted from Shapefile published on 国土地理院 地球地図日本 http://www.gsi.go.jp/kankyochiri/gm_jpn.html )

Data is processed in memory without local caching, ensuring always up-to-date boundary information.

## Special Features

### Tokyo Mainland Filtering

Tokyo Prefecture includes many distant islands (Izu Islands, Ogasawara Islands). The tool automatically filters these out to show only the mainland Tokyo area for better icon visibility.

### Kagoshima Mainland Filtering

Kagoshima Prefecture includes numerous islands (Tanegashima, Yakushima, Amami Islands, etc.). The tool automatically filters these out to show only the mainland areas (Satsuma and Osumi peninsulas) for better icon visibility.

### Text Stroke Outline

All prefecture name text includes a subtle stroke outline using the border color, ensuring optimal readability against any background while maintaining clean visual appearance.

### Transparent Backgrounds

All generated icons have transparent backgrounds, making them suitable for use on any background color or design.

### High-Quality Rendering

Icons are generated via SVG-to-PNG conversion using Puppeteer, ensuring high-quality anti-aliased output at any size.

## Prefecture Codes

Standard JIS prefecture codes (1-47):
- 1: Hokkaido (北海道) - 13: Tokyo (東京都) - 27: Osaka (大阪府) - 47: Okinawa (沖縄県)

## Dependencies

- `@turf/turf` - Geospatial analysis and geometry operations
- `canvas` - Server-side canvas rendering
- `commander` - CLI argument parsing
- `fs-extra` - Enhanced file system operations
- `puppeteer` - SVG to PNG conversion

## Development

```bash
# Clone repository
git clone https://github.com/champierre/jp-pref-icons.git
cd jp-pref-icons

# Install dependencies
npm install

# Generate icons for testing
npx jp-pref-icons --prefecture "東京都" --lw 0.5

# Generate all prefectures
npx jp-pref-icons
```

## License

MIT

## Credits

Built with Japanese prefecture boundary data from:
- [`dataofjapan/land`](https://github.com/dataofjapan/land) repository - japan.geojson
- Based on Shapefile from: 国土地理院 地球地図日本 (Global Map Japan) http://www.gsi.go.jp/kankyochiri/gm_jpn.html