const { clipboard } = require('electron');

/**
 * Copies text to the system clipboard
 * @param {string} text - The text to copy to clipboard
 */
function copyToClipboard(text) {
  clipboard.writeText(text);
}

module.exports = { copyToClipboard };
