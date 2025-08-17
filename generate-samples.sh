#!/bin/bash

# Generate sample icons for jp-pref-icons
echo "Generating sample icons..."

# Remove existing sample icons
rm -f samples/*.png

# Create samples directory if it doesn't exist
mkdir -p samples

# Generate default style icons
echo "Generating default style icons..."
node bin/cli.js --prefecture "北海道,東京都,大阪府" --size 256 --out samples

# Generate text-free version (Tokyo)
echo "Generating text-free version..."
node bin/cli.js --prefecture "東京都" --size 256 --out samples --hide-text
mv samples/13_Tokyo.png samples/13_Tokyo_no_text.png

# Generate custom color versions
echo "Generating custom color versions..."

# Blue Hokkaido
node bin/cli.js --prefecture "北海道" --size 256 --out samples --face "#5dade2" --edge "#2e86c1"
mv samples/01_Hokkaido.png samples/01_Hokkaido_blue.png

# Red Osaka
node bin/cli.js --prefecture "大阪府" --size 256 --out samples --face "#e74c3c" --edge "#c0392b"
mv samples/27_Osaka.png samples/27_Osaka_red.png

# Generate default icons again (since they were overwritten)
node bin/cli.js --prefecture "北海道,東京都,大阪府" --size 256 --out samples

echo "Sample icons generated successfully!"
echo "Generated files:"
ls -la samples/