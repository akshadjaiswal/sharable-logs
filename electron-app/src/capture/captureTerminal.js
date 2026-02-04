const applescript = require('applescript');
const { detectTerminal } = require('./terminalDetector');

async function captureTerminal() {
  // Detect which terminal is active
  const terminal = await detectTerminal();

  if (!terminal) {
    throw new Error('No supported terminal application found. Please make sure Terminal or iTerm is in focus.');
  }

  console.log(`Attempting to capture from ${terminal}...`);

  // Get appropriate AppleScript for terminal
  const script = getTerminalScript(terminal);

  // Execute AppleScript
  return new Promise((resolve, reject) => {
    applescript.execString(script, (err, result) => {
      if (err) {
        reject(new Error(`Failed to capture terminal: ${err.message}`));
      } else {
        resolve({
          content: result || '',
          terminal: terminal,
        });
      }
    });
  });
}

function getTerminalScript(terminal) {
  switch (terminal) {
    case 'Terminal':
      return `
        tell application "Terminal"
          if (count of windows) > 0 then
            tell front window
              set theText to contents of selected tab
              return theText
            end tell
          else
            error "No terminal window open"
          end if
        end tell
      `;

    case 'iTerm':
      return `
        tell application "iTerm"
          if (count of windows) > 0 then
            tell current session of current window
              set theText to contents
              return theText
            end tell
          else
            error "No iTerm window open"
          end if
        end tell
      `;

    case 'Warp':
      // Warp doesn't have great AppleScript support, try to get text via clipboard
      return `
        tell application "System Events"
          tell process "Warp"
            keystroke "a" using {command down}
            keystroke "c" using {command down}
          end tell
        end tell
        delay 0.5
        return the clipboard
      `;

    default:
      // Default to Terminal script
      return `
        tell application "Terminal"
          if (count of windows) > 0 then
            set frontWindow to front window
            set theText to contents of frontWindow
            return theText
          else
            error "No terminal window open"
          end if
        end tell
      `;
  }
}

module.exports = { captureTerminal };
