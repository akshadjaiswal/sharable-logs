const { Tray, Menu, shell, app, nativeImage } = require('electron');
const path = require('path');

let recentLogs = [];

function createTray(captureHandler) {
  // Create tray icon (Template = adapts to light/dark mode)
  const iconPath = path.join(__dirname, '../assets/iconTemplate.png');

  // Check if icon exists, if not use a simple built-in icon
  let trayIcon;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Create a simple icon if file doesn't exist
      trayIcon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAETSURBVDiN7ZS/SgNBEMZ/l4vBwkYttLEQrMRCsbDwAXwBn8BCsBBEsBEfQLC0ELGw8QEEC7HQRrAQbCzEQogtKIKFhf+IxeXMJZfLXS4E/OCYnZ3vm9mdnV0wxhhjjPl/AiwBL0AHSIH1cY7aAD6BL+AMmM0DrAI3GVgT2C0C3gU+hO8SWCwCPhS+C2CuCPhU+C6B2Tzga+FNgMU84AcRa+QBJ8A7sBXiJ+CpKPgVWJH3NtApAn4GVoHWN3An5rFjNdfiBegD0yG+A/RkzMcOIEbHZ0Bdxo+Ah2FgLXY1YqemON+o3wfctXIHqEVuW2KduFMXaN6r8i3QBqaBibB+Dvx93KsLcuoiHxoAK0Vgv80YY4wx/5pfnmhGkKitXBQAAAAASUVORK5CYII=');
    }
  } catch (error) {
    console.error('Failed to load tray icon:', error);
    // Create a minimal icon as fallback
    trayIcon = nativeImage.createEmpty();
  }

  const tray = new Tray(trayIcon);

  tray.setToolTip('LogShare - Terminal Log Capture (Cmd+Shift+L)');

  // Build initial menu
  updateTrayMenu(tray, captureHandler);

  // Add method to update recent logs
  tray.addRecentLog = (log) => {
    recentLogs.unshift({
      id: log.id,
      url: log.url,
      timestamp: new Date().toLocaleString(),
      preview: log.url.substring(log.url.lastIndexOf('/') + 1),
    });

    // Keep only last 10
    if (recentLogs.length > 10) {
      recentLogs.pop();
    }

    updateTrayMenu(tray, captureHandler);
  };

  return tray;
}

function updateTrayMenu(tray, captureHandler) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture Log',
      accelerator: 'CommandOrControl+Shift+L',
      click: () => {
        if (captureHandler) {
          captureHandler();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Recent Logs',
      submenu: recentLogs.length > 0
        ? recentLogs.map(log => ({
            label: `${log.timestamp} - ${log.preview}`,
            click: () => {
              shell.openExternal(log.url);
            }
          }))
        : [{ label: 'No recent logs', enabled: false }]
    },
    { type: 'separator' },
    {
      label: 'Preferences...',
      click: () => {
        // Open preferences window
        try {
          const preferences = require('./windows/preferences');
          preferences.openPreferences();
        } catch (error) {
          console.error('Failed to open preferences:', error);
        }
      }
    },
    {
      label: 'Open LogShare Website',
      click: () => {
        shell.openExternal('http://localhost:3000');
      }
    },
    { type: 'separator' },
    {
      label: 'About LogShare',
      click: () => {
        const { dialog } = require('electron');
        dialog.showMessageBox({
          type: 'info',
          title: 'About LogShare',
          message: 'LogShare Desktop v1.0.0',
          detail: 'Terminal log capture and sharing made easy.\n\nPress Cmd+Shift+L to capture your terminal output.',
          buttons: ['OK']
        });
      }
    },
    { type: 'separator' },
    {
      label: 'Quit LogShare',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

module.exports = { createTray };
