const { app, globalShortcut, Notification } = require('electron');
const path = require('path');
const { createTray } = require('./src/tray');
const { captureTerminal } = require('./src/capture/captureTerminal');
const { uploadLog } = require('./src/api/apiClient');
const { copyToClipboard } = require('./src/utils/clipboard');

// Keep reference to prevent garbage collection
let tray = null;

// App ready
app.whenReady().then(() => {
  console.log('LogShare app starting...');

  // Create menubar tray
  tray = createTray(handleCapture);

  // Register global hotkey: Cmd+Shift+L
  const ret = globalShortcut.register('CommandOrControl+Shift+L', async () => {
    console.log('Hotkey pressed: Capturing terminal...');
    await handleCapture();
  });

  if (!ret) {
    console.error('Global shortcut registration failed');
  } else {
    console.log('✓ Hotkey registered: Cmd+Shift+L');
  }

  // Check if registered
  console.log('Hotkey registered:', globalShortcut.isRegistered('CommandOrControl+Shift+L'));
});

// Handle capture and upload
async function handleCapture() {
  try {
    console.log('Starting capture...');

    // 1. Capture terminal
    const { content, terminal } = await captureTerminal();

    if (!content || content.trim().length === 0) {
      showNotification('Error', 'No terminal content captured');
      return;
    }

    console.log(`✓ Captured ${content.length} characters from ${terminal}`);

    // 2. Upload to API
    showNotification('Uploading...', 'Uploading log to LogShare');
    const result = await uploadLog(content, { terminal, os: process.platform });

    console.log(`✓ Uploaded successfully: ${result.url}`);

    // 3. Copy URL to clipboard
    copyToClipboard(result.url);

    // 4. Show success notification
    showNotification('Log Uploaded!', `URL copied to clipboard:\n${result.url}`);

    // 5. Add to recent logs (handled by tray)
    if (tray && tray.addRecentLog) {
      tray.addRecentLog(result);
    }

  } catch (error) {
    console.error('Capture failed:', error);
    showNotification('Error', error.message || 'Failed to capture or upload log');
  }
}

// Show macOS notification
function showNotification(title, body) {
  const notification = new Notification({
    title,
    body,
    silent: false,
  });
  notification.show();
}

// Cleanup on quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  console.log('LogShare app quitting...');
});

// macOS: Don't quit when all windows closed (menubar app)
app.on('window-all-closed', () => {
  // Keep app running (menubar app behavior)
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('Another instance is already running. Quitting...');
  app.quit();
}

// Handle app activation (macOS)
app.on('activate', () => {
  // On macOS it's common to re-create a window when the
  // dock icon is clicked and there are no other windows open.
  // For menubar apps, we don't need to do anything here.
});

console.log('LogShare main process initialized');
