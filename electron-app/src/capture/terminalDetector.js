const applescript = require('applescript');

async function detectTerminal() {
  // Check which terminal app is running and focused
  const script = `
    tell application "System Events"
      set frontApp to name of first application process whose frontmost is true
      return frontApp
    end tell
  `;

  return new Promise((resolve) => {
    applescript.execString(script, (err, result) => {
      if (err) {
        console.error('Failed to detect terminal:', err);
        resolve(null);
      } else {
        console.log('Detected app:', result);
        // Map app name to our identifier
        if (result === 'Terminal') {
          resolve('Terminal');
        } else if (result === 'iTerm2' || result === 'iTerm') {
          resolve('iTerm');
        } else if (result === 'Warp') {
          resolve('Warp');
        } else if (result === 'Hyper') {
          resolve('Hyper');
        } else {
          // Try Terminal as default
          resolve('Terminal');
        }
      }
    });
  });
}

module.exports = { detectTerminal };
