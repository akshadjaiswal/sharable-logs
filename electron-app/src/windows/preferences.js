const { BrowserWindow } = require('electron');
const path = require('path');

let preferencesWindow = null;

/**
 * Opens the preferences window
 * If window is already open, brings it to focus
 */
function openPreferences() {
  if (preferencesWindow) {
    preferencesWindow.focus();
    return;
  }

  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 500,
    title: 'LogShare Preferences',
    resizable: false,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  preferencesWindow.loadFile(path.join(__dirname, 'preferences.html'));

  // Remove menu bar (macOS)
  preferencesWindow.setMenuBarVisibility(false);

  preferencesWindow.on('closed', () => {
    preferencesWindow = null;
  });
}

module.exports = { openPreferences };
