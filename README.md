# japan-prefecture-icons

Generate beautiful icon images for Japanese prefectures with official government data. This tool automatically downloads the latest boundary data from official sources and creates high-quality PNG icons with optional SVG output.

> 📖 **日本語ドキュメント**: [README_JP.md](README_JP.md)

## Features

- 🗾 **Official Data**: Automatically downloads prefecture boundaries from national land information sources
- 🎨 **Customizable**: Adjustable colors, sizes, and border styles
- 🌍 **Smart Filtering**: Tokyo shows mainland only (excludes distant islands for better visibility)
- 🔤 **Flexible Text**: Show or hide prefecture names on icons
- 📁 **Multiple Formats**: PNG and SVG output with transparent backgrounds
- 🎯 **Selective Generation**: Generate specific prefectures by name or code
- 🖥️ **Easy CLI**: Simple command-line interface

## Installation

### NPX (Recommended - No installation required)

```bash
# Generate all prefecture icons in current directory
npx japan-prefecture-icons

# Generate specific prefecture
npx japan-prefecture-icons --prefecture "東京都"

# Generate without text labels
npx japan-prefecture-icons --prefecture "東京都" --hide-text

# Custom styling
npx japan-prefecture-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### Local Installation

```bash
npm install japan-prefecture-icons
```

## Quick Start

### Using NPX (No installation required)

```bash
# Generate all prefectures (downloads official data automatically)
npx japan-prefecture-icons

# Generate specific prefecture
npx japan-prefecture-icons --prefecture "東京都"

# Generate without text labels  
npx japan-prefecture-icons --prefecture "東京都" --hide-text

# Custom styling
npx japan-prefecture-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### Using Local Installation

```bash
# Generate all prefectures (downloads official data automatically)
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
npx japan-prefecture-icons

# Use custom GeoJSON file
npx japan-prefecture-icons --geojson custom-prefectures.geojson
```

### Generate Specific Prefectures

```bash
# Single prefecture by name
npx japan-prefecture-icons --prefecture "東京都"

# Multiple prefectures by name
npx japan-prefecture-icons --prefecture "東京都,大阪府,神奈川県"

# By prefecture codes
npx japan-prefecture-icons --prefecture "13,27,14"

# Mixed names and codes
npx japan-prefecture-icons --prefecture "13,大阪府,Tokyo"
```

### Styling Options

```bash
# Thin borders
npx japan-prefecture-icons --prefecture "東京都" --lw 0.5

# No text labels
npx japan-prefecture-icons --prefecture "東京都" --hide-text

# Custom colors
npx japan-prefecture-icons --prefecture "東京都" --face "#2E8B57" --edge "#1C5F3F" --text "#FFFFFF"

# Large size with SVG
npx japan-prefecture-icons --prefecture "東京都" --size 2048 --svg
```

### Programmatic Usage

```javascript
const PrefectureIconGenerator = require('./src/index');

const generator = new PrefectureIconGenerator({
  size: 1024,                    // Icon size in pixels
  lineWidth: 0.5,               // Border line width
  faceColor: '#0E7A6F',         // Fill color
  edgeColor: '#0A5A52',         // Border color
  textColor: '#FFFFFF',         // Text color
  outputDir: 'icons',           // Output directory
  generateSVG: false,           // Also generate SVG files
  showText: true,               // Show prefecture names
  targetPrefectures: '東京都,大阪府' // Specific prefectures
});

// Generate icons (downloads official data automatically)
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
| `--size <number>` | Icon size in pixels (square) | `1024` |
| `--lw <number>` | Line width | `2.0` |
| `--face <color>` | Face/fill color | `#0E7A6F` |
| `--edge <color>` | Edge/border color | `#0A5A52` |
| `--text <color>` | Text color | `#FFFFFF` |
| `--svg` | Also generate SVG files | `false` |
| `--prefecture <names>` | Generate only specified prefectures | All |
| `--hide-text` | Generate icons without text labels | `false` |

## Output Format

Icons are saved with the following naming convention:
- `{prefecture_code}_{romanized_name}.png` (e.g., `13_Tokyo.png`, `27_Osaka.png`)

## Data Sources

The tool automatically downloads official Japanese prefecture boundary data from:

- **Primary**: `dataofjapan/land` repository (based on 国土地理院 data)
- **Fallback**: `smartnews-smri/japan-topography` (alternative high-quality source)

Data is processed in memory without local caching, ensuring always up-to-date official boundary information.

## Special Features

### Tokyo Mainland Filtering

Tokyo Prefecture includes many distant islands (Izu Islands, Ogasawara Islands). The tool automatically filters these out to show only the mainland Tokyo area for better icon visibility.

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
git clone https://github.com/champierre/japan-prefecture-icons.git
cd japan-prefecture-icons

# Install dependencies
npm install

# Generate icons for testing
npx japan-prefecture-icons --prefecture "東京都" --lw 0.5

# Generate all prefectures
npx japan-prefecture-icons
```

## License

MIT

## Credits

Built with official Japanese government boundary data from the Geospatial Information Authority of Japan (国土地理院).