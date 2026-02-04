const axios = require('axios');
const { detectContext } = require('../utils/detectContext');
const { redactSensitive } = require('../utils/redactSensitive');
const Store = require('electron-store');

const store = new Store();

async function uploadLog(content, metadata = {}) {
  try {
    // Get API base URL from settings (or use default)
    const API_BASE_URL = store.get('apiEndpoint', 'http://localhost:3000');

    // 1. Detect context (Next.js, Python, etc.)
    const detected_context = detectContext(content);
    console.log(`Detected context: ${detected_context}`);

    // 2. Redact sensitive data
    const { content: redactedContent, redacted } = redactSensitive(content);
    if (redacted) {
      console.log('⚠️  Sensitive data was redacted');
    }

    // 3. Prepare payload
    const payload = {
      content: redactedContent,
      metadata: {
        terminal: metadata.terminal || 'Unknown',
        os: getOSInfo(),
        context: detected_context,
      }
    };

    console.log(`Uploading to ${API_BASE_URL}/api/logs/create...`);

    // 4. POST to API
    const response = await axios.post(`${API_BASE_URL}/api/logs/create`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    return {
      id: response.data.id,
      url: response.data.url,
      redacted: response.data.redacted || redacted,
    };

  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach LogShare API. Is the web app running?');
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

function getOSInfo() {
  const os = require('os');
  return `macOS ${os.release()} (${os.arch()})`;
}

module.exports = { uploadLog };
