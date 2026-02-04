# LogShare Desktop App Icons

This directory contains the icons and assets for the LogShare macOS menubar app.

## Required Icons

### 1. Menubar Icon (Template Icons)
These icons appear in the macOS system tray/menubar.

- **iconTemplate.png** (22x22px) - Standard resolution
- **iconTemplate@2x.png** (44x44px) - Retina resolution

**Design Guidelines:**
- Monochrome (black on transparent background)
- Simple, recognizable symbol (terminal window or log icon)
- Use "Template" suffix for automatic dark mode adaptation
- macOS will automatically adjust colors based on system theme

### 2. App Icon
- **icon.png** (512x512px) - Main app icon
- Used for the app dock icon and installer

**Design Guidelines:**
- Full color logo for LogShare
- Rounded corners (optional, macOS will apply automatically)
- Use LogShare brand colors: #B8860B (burnished gold), #1A1A1A (rich black)

## Current Status

⚠️ **Icons Not Created Yet**

The app will work without custom icons but will use Electron's default icons.

## How to Create Icons

### Option 1: Design from Scratch
1. Use a design tool (Figma, Sketch, Illustrator)
2. Export at the exact sizes listed above
3. Save as PNG with transparency

### Option 2: Use Placeholder
For testing, you can use simple text-based icons:
- Menubar: Simple "L" or terminal symbol
- App icon: LogShare text with background color

### Option 3: Icon Generation Tools
Use online tools like:
- https://www.appicon.co/ (generates all sizes)
- https://makeappicon.com/

## Testing Without Icons

The app will run without custom icons. You'll see:
- Default Electron icon in menubar
- Default app icon in dock

To test, simply run:
```bash
npm start
```

## Installation After Creation

Once you have the icons:
1. Place them in this `assets/` directory
2. Update `main.js` if paths need adjustment
3. Rebuild the app: `npm run build`
