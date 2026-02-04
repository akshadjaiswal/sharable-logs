# Git Commit Guide for Electron App

This guide helps you properly commit the Electron desktop app files.

---

## Files to Commit (Add to Git)

### Essential Source Files
```bash
# Add Electron app configuration
git add electron-app/.gitignore
git add electron-app/package.json
git add electron-app/main.js

# Add source code
git add electron-app/src/

# Add icons (generated from SVG)
git add electron-app/assets/icon.png
git add electron-app/assets/iconTemplate.png
git add electron-app/assets/iconTemplate@2x.png
git add electron-app/assets/README.md

# Add icon generator script
git add electron-app/create-icons.js

# Add documentation
git add docs/electron-app/
```

---

## Files to EXCLUDE (Already in .gitignore)

These should NOT be committed:

```
electron-app/node_modules/          # Dependencies (large)
electron-app/dist/                  # Build output (90MB DMG)
electron-app/package-lock.json      # Lock file (can regenerate)
```

---

## Recommended Commit Message

```
feat: Add Electron macOS desktop app with proper icons and distribution

- Implement menubar-only macOS app for terminal log capture
- Add global hotkey (Cmd+Shift+L) for instant log sharing
- Create app icons from LogShare brand logo (gold + document)
- Build DMG installer for easy distribution
- Add comprehensive documentation in docs/electron-app/

Features:
- AppleScript terminal capture (Terminal, iTerm2, Warp, Hyper)
- Auto-detect framework/language context
- Auto-redact sensitive data (API keys, passwords, etc.)
- Recent logs tracking (last 10 uploads)
- Preferences window for configuration
- Menubar integration (no dock icon)

Technical:
- Fix LSUIElement configuration for menubar-only behavior
- Fix AppleScript to capture full terminal scrollback buffer
- Generate PNG icons from SVG logo at multiple sizes
- electron-builder for DMG packaging

Documentation:
- Installation guide for end users
- Quick start guide (2 minutes)
- Complete user guide
- Testing guide (11 test scenarios)
- Implementation summary for developers

Closes #[issue-number] (if applicable)
```

---

## Step-by-Step Git Commands

### 1. Check Status
```bash
git status
```

You should see:
- `electron-app/` directory (new)
- `docs/electron-app/` directory (new)

### 2. Add Files (Selectively)
```bash
# Add Electron app source
git add electron-app/.gitignore
git add electron-app/package.json
git add electron-app/main.js
git add electron-app/src/
git add electron-app/assets/*.png
git add electron-app/assets/README.md
git add electron-app/create-icons.js

# Add documentation
git add docs/electron-app/
```

### 3. Verify What Will Be Committed
```bash
git status
```

Should show:
- ✅ `electron-app/` source files
- ✅ `electron-app/assets/` icon files
- ✅ `docs/electron-app/` documentation
- ❌ NOT `electron-app/dist/` (build output)
- ❌ NOT `electron-app/node_modules/` (dependencies)

### 4. Commit
```bash
git commit -m "feat: Add Electron macOS desktop app with proper icons and distribution

- Implement menubar-only macOS app for terminal log capture
- Add global hotkey (Cmd+Shift+L) for instant log sharing
- Create app icons from LogShare brand logo
- Build DMG installer for easy distribution
- Add comprehensive documentation

🤖 Generated with Claude Code"
```

### 5. Push (Optional)
```bash
git push origin building-app
```

---

## Files Summary

### What's Included in Git (Should Commit)

| Path | Size | Description |
|------|------|-------------|
| `electron-app/.gitignore` | ~2 KB | Ignore build artifacts |
| `electron-app/package.json` | ~1 KB | Dependencies & build config |
| `electron-app/main.js` | ~3 KB | Main Electron process |
| `electron-app/src/` | ~10 KB | Source code (7 files) |
| `electron-app/assets/*.png` | ~23 KB | App icons (3 files) |
| `electron-app/create-icons.js` | ~6 KB | Icon generator script |
| `docs/electron-app/*.md` | ~40 KB | Documentation (6 files) |
| **Total** | **~85 KB** | Clean, essential files only |

### What's Excluded (Don't Commit)

| Path | Size | Reason |
|------|------|--------|
| `electron-app/node_modules/` | ~143 MB | Dependencies (regenerated with `npm install`) |
| `electron-app/dist/` | ~180 MB | Build output (regenerated with `npm run build`) |
| `electron-app/package-lock.json` | ~350 KB | Lock file (optional, can regenerate) |
| **Total Excluded** | **~323 MB** | Saves repository space |

---

## Verify .gitignore is Working

After adding files, run:

```bash
git status --ignored
```

Should show:
- `electron-app/node_modules/` - ignored
- `electron-app/dist/` - ignored
- Other large files - ignored

---

## Branch Information

Your current branch: `building-app`

This is perfect for:
1. Committing Electron app work
2. Creating pull request to `main`
3. Merging after review

---

## Quick Checklist

Before committing, verify:

- [ ] `.gitignore` is in place
- [ ] No `dist/` or `node_modules/` in commit
- [ ] All source files included (`src/`, `main.js`, etc.)
- [ ] Icons included (`assets/*.png`)
- [ ] Documentation included (`docs/electron-app/`)
- [ ] Package.json included
- [ ] Total commit size < 100 KB (excluding large binaries)

---

## After Commit

### Test Clean Install
```bash
# Clone fresh
git clone <repo-url>
cd sharable-logs/electron-app

# Install dependencies
npm install

# Build app
npm run build

# Should work without errors
```

### Create Pull Request
```bash
# Push to remote
git push origin building-app

# Create PR on GitHub
# Title: "feat: Add Electron macOS desktop app"
# Description: (use commit message as template)
```

---

## Helpful Git Commands

### View Commit Preview
```bash
git diff --cached --stat
```

### Remove Files from Staging
```bash
git reset HEAD <file>
```

### Check Total Commit Size
```bash
git diff --cached --stat | tail -1
```

### Unstage Everything
```bash
git reset HEAD
```

---

**Ready to commit!** ✅

Run the commands above, then verify with `git status` before pushing.
