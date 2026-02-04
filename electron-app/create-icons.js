#!/usr/bin/env node

/**
 * Icon Generator Script for LogShare Desktop App
 *
 * This script converts the SVG logo from the web app into PNG icons
 * required by the Electron app at various sizes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 LogShare Icon Generator\n');

// Paths
const svgPath = path.join(__dirname, '../app/app/icon.svg');
const assetsDir = path.join(__dirname, 'assets');

// Icon specifications
const icons = [
  {
    name: 'icon.png',
    size: 512,
    description: 'App icon (dock, DMG installer)',
    grayscale: false
  },
  {
    name: 'iconTemplate.png',
    size: 22,
    description: 'Menubar icon (standard)',
    grayscale: true
  },
  {
    name: 'iconTemplate@2x.png',
    size: 44,
    description: 'Menubar icon (retina)',
    grayscale: true
  }
];

// Check if SVG source exists
if (!fs.existsSync(svgPath)) {
  console.error(`❌ Error: SVG logo not found at: ${svgPath}`);
  process.exit(1);
}

console.log(`✓ Found SVG logo: ${svgPath}\n`);

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`✓ Created assets directory\n`);
}

// Check for available conversion tools
let conversionMethod = null;

// Try ImageMagick
try {
  execSync('which convert', { stdio: 'ignore' });
  conversionMethod = 'imagemagick';
  console.log('✓ Using ImageMagick for conversion\n');
} catch (e) {
  // ImageMagick not available
}

// Try rsvg-convert
if (!conversionMethod) {
  try {
    execSync('which rsvg-convert', { stdio: 'ignore' });
    conversionMethod = 'rsvg';
    console.log('✓ Using rsvg-convert for conversion\n');
  } catch (e) {
    // rsvg not available
  }
}

// Try sips (macOS built-in)
if (!conversionMethod) {
  try {
    execSync('which sips', { stdio: 'ignore' });
    conversionMethod = 'sips';
    console.log('✓ Using sips (macOS) for conversion\n');
  } catch (e) {
    // sips not available (not on macOS)
  }
}

if (!conversionMethod) {
  console.error('❌ Error: No conversion tool available.');
  console.error('\nPlease install one of the following:');
  console.error('  • ImageMagick: brew install imagemagick');
  console.error('  • librsvg: brew install librsvg');
  console.error('\nOr manually create the icons using a design tool.\n');
  process.exit(1);
}

// Convert icons
console.log('Converting icons...\n');

for (const icon of icons) {
  const outputPath = path.join(assetsDir, icon.name);

  try {
    if (conversionMethod === 'imagemagick') {
      let cmd = `convert "${svgPath}" -resize ${icon.size}x${icon.size}`;
      if (icon.grayscale) {
        cmd += ' -colorspace Gray';
      }
      cmd += ` "${outputPath}"`;
      execSync(cmd);
    } else if (conversionMethod === 'rsvg') {
      // First convert SVG to PNG at size
      execSync(`rsvg-convert -w ${icon.size} -h ${icon.size} "${svgPath}" -o "${outputPath}"`);

      // Then convert to grayscale if needed
      if (icon.grayscale) {
        execSync(`sips -s format png -s formatOptions normal --setProperty format gray "${outputPath}"`);
      }
    } else if (conversionMethod === 'sips') {
      // sips can't convert SVG directly, need intermediate step
      // Convert SVG to PDF first (macOS can do this)
      const tempPdf = path.join(assetsDir, 'temp.pdf');
      execSync(`qlmanage -t -s ${icon.size} -o "${assetsDir}" "${svgPath}"`, { stdio: 'ignore' });

      // Find the generated thumbnail
      const svgFilename = path.basename(svgPath);
      const thumbnailPath = path.join(assetsDir, svgFilename + '.png');

      if (fs.existsSync(thumbnailPath)) {
        // Resize and optionally convert to grayscale
        let cmd = `sips -z ${icon.size} ${icon.size}`;
        if (icon.grayscale) {
          cmd += ' -s format gray';
        }
        cmd += ` "${thumbnailPath}" --out "${outputPath}"`;
        execSync(cmd);

        // Clean up thumbnail
        fs.unlinkSync(thumbnailPath);
      } else {
        throw new Error('Thumbnail generation failed');
      }
    }

    console.log(`  ✓ Created ${icon.name} (${icon.size}x${icon.size})`);
    console.log(`    ${icon.description}`);
    if (icon.grayscale) {
      console.log(`    Grayscale: ✓`);
    }
    console.log('');

  } catch (error) {
    console.error(`  ❌ Failed to create ${icon.name}`);
    console.error(`     Error: ${error.message}\n`);
  }
}

console.log('✅ Icon generation complete!\n');
console.log('Next steps:');
console.log('  1. Run: npm run build');
console.log('  2. Install: Open dist/LogShare-1.0.0.dmg');
console.log('  3. Launch: Double-click LogShare in Applications\n');
