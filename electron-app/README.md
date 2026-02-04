# LogShare Desktop App (macOS)

A macOS menubar application for capturing and sharing terminal logs with a single keyboard shortcut.

## Features

- **Global Hotkey**: Press `Cmd+Shift+L` to capture terminal output
- **Auto-Upload**: Automatically uploads to LogShare web app
- **Smart Detection**: Detects framework/language context (Next.js, Python, Docker, etc.)
- **Privacy**: Automatically redacts sensitive data (API keys, passwords, emails, IPs)
- **Clipboard Integration**: Shareable URL copied instantly
- **Recent Logs**: Access your last 10 uploaded logs from menubar
- **Notifications**: macOS notifications confirm successful uploads
- **Multiple Terminals**: Supports Terminal.app, iTerm2, Warp, and Hyper

## Prerequisites

- macOS 10.13 (High Sierra) or later
- Node.js 16+ installed
- LogShare web app running (default: http://localhost:3000)

## Installation

### 1. Install Dependencies

```bash
cd electron-app
npm install
```

### 2. Configure API Endpoint (Optional)

By default, the app connects to `http://localhost:3000`. To change this:

1. Launch the app
2. Right-click menubar icon → **Preferences**
3. Update API Endpoint
4. Click **Save Preferences**

Alternatively, set it in `src/api/apiClient.js`:
```javascript
const API_BASE_URL = store.get('apiEndpoint', 'http://localhost:3000');
```

## Usage

### Start the App

```bash
npm start
```

The LogShare icon will appear in your macOS menubar.

### Capture Terminal Logs

1. **Open any supported terminal** (Terminal, iTerm2, Warp, Hyper)
2. **Press `Cmd+Shift+L`** to capture
3. **Wait for notification** confirming upload
4. **Shareable URL is copied** to your clipboard automatically

### Menubar Options

Right-click the LogShare menubar icon to access:

- **Capture Log** - Trigger capture manually
- **Recent Logs** - View last 10 uploaded logs
- **Preferences** - Configure settings
- **Open LogShare** - Open web app in browser
- **Quit LogShare** - Exit the app

### Preferences

- **Launch at startup** - Start LogShare when you log in (⚠️ Not yet implemented)
- **Show notifications** - Display macOS notifications
- **API Endpoint** - URL of LogShare web app

## Permissions

On first use, macOS will request permissions:

1. **Accessibility Access** - Required to capture terminal content
2. **Notifications** - Optional, for upload confirmations

Grant these in **System Preferences → Security & Privacy → Privacy**.

## How It Works

1. **Hotkey Pressed**: Global shortcut triggers capture
2. **Terminal Detection**: AppleScript identifies active terminal app
3. **Content Capture**: AppleScript retrieves terminal output
4. **Context Detection**: Analyzes content to identify framework/language
5. **Sensitive Data Redaction**: Automatically removes API keys, tokens, passwords
6. **Upload**: POSTs to LogShare API (`/api/logs/create`)
7. **Clipboard**: Copies shareable URL
8. **Notification**: Displays success message

## Supported Terminals

- **Terminal.app** (macOS default) ✅
- **iTerm2** ✅
- **Warp** ✅ (uses clipboard workaround)
- **Hyper** ⚠️ (limited support)

## Troubleshooting

### Global Hotkey Not Working
- Check macOS Privacy settings for Accessibility access
- Ensure no other app is using `Cmd+Shift+L`
- Restart the app

### Terminal Not Capturing
- Make sure terminal window is in focus
- Verify terminal is listed in supported terminals
- Check Console.app for AppleScript errors

### Upload Fails
- Confirm web app is running at configured API endpoint
- Check network connectivity
- View error details in notification

### Permissions Denied
- Go to **System Preferences → Security & Privacy → Privacy**
- Add LogShare to **Accessibility** and **Automation** lists
- Restart the app

## Development

### Project Structure

```
electron-app/
├── main.js                     # Main Electron process
├── package.json                # Dependencies & scripts
├── src/
│   ├── tray.js                # Menubar icon & menu
│   ├── capture/
│   │   ├── captureTerminal.js # AppleScript capture
│   │   └── terminalDetector.js # Detect active terminal
│   ├── api/
│   │   └── apiClient.js       # API communication
│   ├── utils/
│   │   ├── detectContext.js   # Framework detection
│   │   ├── redactSensitive.js # Sensitive data redaction
│   │   └── clipboard.js       # Clipboard operations
│   └── windows/
│       ├── preferences.js     # Preferences window
│       └── preferences.html   # Preferences UI
├── assets/
│   └── README.md              # Icon guidelines
└── README.md                  # This file
```

### Scripts

```bash
npm start          # Launch app in development
npm run package    # Package app (without installer)
npm run build      # Build DMG installer
```

### Adding Support for New Terminals

Edit `src/capture/captureTerminal.js` and add a new case:

```javascript
case 'YourTerminal':
  return `
    tell application "YourTerminal"
      -- AppleScript to get content
    end tell
  `;
```

Also update `src/capture/terminalDetector.js` to detect it:

```javascript
else if (result === 'YourTerminal') {
  resolve('YourTerminal');
}
```

## Building for Distribution

### Create DMG Installer

```bash
npm run build
```

Output: `dist/LogShare-1.0.0.dmg`

### Code Signing (Requires Apple Developer Account)

1. Get Apple Developer certificate
2. Update `package.json` with certificate info
3. Run `npm run build` with signing enabled

### Notarization (For macOS Catalina+)

Required for distribution outside Mac App Store.

See: https://www.electron.build/configuration/mac

## API Integration

The app communicates with the LogShare web API:

### Endpoint: POST /api/logs/create

**Request:**
```json
{
  "content": "captured terminal content",
  "metadata": {
    "terminal": "iTerm",
    "os": "macOS 14.2.1 (arm64)",
    "context": "Next.js"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "http://localhost:3000/log/uuid",
  "redacted": true
}
```

## Privacy & Security

- **No Data Collection**: Logs only sent to your configured API endpoint
- **Local Storage**: Preferences stored locally via electron-store
- **Automatic Redaction**: 12+ patterns for sensitive data detection
- **Open Source**: Full code available for audit

### Redacted Data Types

- API keys and tokens
- JWT tokens
- Passwords
- Email addresses
- IP addresses (IPv4)
- Credit card numbers
- AWS access keys
- SSH private keys
- Database connection strings
- Bearer tokens

## Known Limitations

1. **macOS Only**: Not available for Windows or Linux (yet)
2. **Terminal Apps**: Limited to apps with AppleScript support
3. **Large Logs**: Very large terminal outputs may be truncated
4. **No Authentication**: All logs are public (web app limitation)
5. **Launch at Startup**: Feature not yet implemented

## Future Enhancements

- [ ] Windows/Linux support
- [ ] Custom hotkey configuration
- [ ] Log expiration settings
- [ ] Private/encrypted logs
- [ ] Slack integration
- [ ] Auto-update mechanism
- [ ] Launch at startup (auto-launch)
- [ ] Log history with search

## Contributing

### Code Style
- Use Node.js CommonJS modules
- Follow existing patterns in the codebase
- Test on multiple terminals before submitting

### Reporting Issues
Include:
- macOS version
- Terminal app and version
- Error messages from Console.app
- Steps to reproduce

## License

MIT License - See LICENSE file

## Links

- **Web App**: http://localhost:3000
- **GitHub**: [Repository URL]
- **Documentation**: ../CLAUDE.md

## Support

For issues or questions:
1. Check this README
2. Review web app documentation (../CLAUDE.md)
3. Check Console.app for Electron errors
4. Open an issue on GitHub

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Status**: MVP Complete ✅
