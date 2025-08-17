# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands
- `npm install` - Install dependencies
- `node bin/cli.js --geojson prefectures.geojson` - Run the CLI tool locally to generate icons
- `node bin/cli.js --geojson prefectures.geojson --out custom_icons --size 2048 --svg` - Generate icons with custom parameters

### Testing
- No test framework is currently configured. The test script in package.json references a non-existent test file.

## Architecture

### Core Components

**PrefectureIconGenerator** (`src/index.js`)
- Main class that handles icon generation from GeoJSON data
- Processes prefecture geometries using Turf.js for geospatial calculations
- Renders icons using node-canvas for PNG generation
- Supports both single polygons and multi-polygons
- Automatically centers and scales prefecture shapes within the icon bounds

**Prefecture Data** (`src/prefectures.js`)
- Contains mappings for all 47 Japanese prefectures
- NAMES_JA: JIS code (1-47) to Japanese prefecture names
- ROMAJI: JIS code to romanized prefecture names
- Used for naming output files and displaying prefecture text on icons

**CLI Interface** (`bin/cli.js`)
- Commander.js-based CLI with options for customizing icon appearance
- Validates GeoJSON file existence before processing
- Passes configuration to PrefectureIconGenerator

### Key Dependencies
- `@turf/turf` - Geospatial analysis and geometry operations
- `canvas` - Server-side canvas implementation for image generation
- `commander` - CLI argument parsing and help generation
- `fs-extra` - Enhanced file system operations

### Data Flow
1. CLI receives GeoJSON file path and generation options
2. PrefectureIconGenerator loads and parses the GeoJSON
3. Features are grouped by prefecture code or name
4. For each prefecture:
   - Geometry is combined if multiple features exist
   - Bounding box is calculated and made square with padding
   - Canvas rendering draws the shape with specified colors
   - Text overlay adds the Japanese prefecture name
   - PNG (and optionally SVG) files are saved

### File Naming Convention
Icons are saved as: `{prefecture_code}_{romaji_name}.png` (e.g., `13_Tokyo.png`)

### GeoJSON Field Detection
The tool automatically detects prefecture identifiers from these possible field names:
- Code fields: code, pref_code, jiscode, PREF_CODE, PREF
- Name fields: nam_ja, name_ja, NAME_JA, name, NAME, pref_name, P