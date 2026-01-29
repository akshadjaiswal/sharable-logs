import { codeToHtml } from 'shiki';

/**
 * Custom highlighting for HTTP request logs
 * Shiki doesn't support HTTP logs well, so we add custom CSS classes
 * Order matters: Apply most specific patterns first to avoid conflicts
 */
function enhanceHTTPHighlighting(html: string): string {
  let enhanced = html;

  // 1. Highlight HTTP methods
  enhanced = enhanced.replace(
    /\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|CONNECT|TRACE)\b/g,
    '<span class="http-method">$1</span>'
  );

  // 2. Highlight HTTP version
  enhanced = enhanced.replace(
    /\b(HTTP\/[0-9.]+)\b/g,
    '<span class="http-version">$1</span>'
  );

  // 3. Highlight URL paths
  enhanced = enhanced.replace(
    /\s(\/[^\s?]*)/g,
    ' <span class="http-path">$1</span>'
  );

  // 4. Highlight query parameters
  enhanced = enhanced.replace(
    /(\?[^\s]+)/g,
    '<span class="http-query">$1</span>'
  );

  // 5. Highlight headers
  enhanced = enhanced.replace(
    /^([A-Z][A-Za-z-]+):\s*(.+)$/gm,
    '<span class="http-header">$1:</span> <span class="http-header-value">$2</span>'
  );

  // 6. Highlight IP addresses
  enhanced = enhanced.replace(
    /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
    '<span class="http-ip">$1</span>'
  );

  // 7. Highlight ports
  enhanced = enhanced.replace(
    /:(\d{2,5})\b/g,
    ':<span class="http-port">$1</span>'
  );

  // 8. Highlight status codes by category
  enhanced = enhanced.replace(
    /\b(1\d{2})\b/g,
    '<span class="status-info">$1</span>'
  );
  enhanced = enhanced.replace(
    /\b(2\d{2})\b/g,
    '<span class="status-success">$1</span>'
  );
  enhanced = enhanced.replace(
    /\b(3\d{2})\b/g,
    '<span class="status-redirect">$1</span>'
  );
  enhanced = enhanced.replace(
    /\b(4\d{2})\b/g,
    '<span class="status-client-error">$1</span>'
  );
  enhanced = enhanced.replace(
    /\b(5\d{2})\b/g,
    '<span class="status-server-error">$1</span>'
  );

  // 9. Highlight timing metrics
  enhanced = enhanced.replace(
    /(\d+(?:\.\d+)?)(ms|μs|s)\b/g,
    '<span class="timing">$1<span class="unit">$2</span></span>'
  );

  // 10. Highlight compile/render labels
  enhanced = enhanced.replace(
    /(compile|render):/gi,
    '<span class="metric-label">$1:</span>'
  );

  return enhanced;
}

/**
 * Highlights code using Shiki with server-side rendering
 * @param content - The code content to highlight
 * @param language - The language for syntax highlighting
 * @returns HTML string with syntax highlighting
 */
export async function highlightCode(
  content: string,
  language: string = 'text'
): Promise<string> {
  try {
    // Map common language aliases to Shiki language identifiers
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      py: 'python',
      rb: 'ruby',
      sh: 'bash',
      shell: 'bash',
      yml: 'yaml',
      md: 'markdown',
      dockerfile: 'docker',
      text: 'txt',
      plaintext: 'txt',
    };

    const mappedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();

    // Use Shiki to generate highlighted HTML
    const html = await codeToHtml(content, {
      lang: mappedLanguage,
      theme: 'min-light', // Warm, minimal theme matching design system
    });

    // Return HTML as-is - HTTP enhancement is now applied client-side per-line
    // This ensures proper styling regardless of Shiki's output structure
    return html;
  } catch (error) {
    console.error('Syntax highlighting error:', error);

    // Fallback: return content wrapped in pre/code tags without highlighting
    return `<pre class="shiki" style="background-color:#FAFAF8;color:#1A1A1A"><code>${escapeHtml(content)}</code></pre>`;
  }
}

/**
 * Get list of supported languages by Shiki
 * Useful for validation or UI dropdowns
 */
export const supportedLanguages = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'bash',
  'shell',
  'java',
  'go',
  'rust',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'markdown',
  'dockerfile',
  'nginx',
  'apache',
  'text',
] as const;

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): boolean {
  return supportedLanguages.includes(language as any);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Add line numbers to highlighted code
 * @param highlightedHtml - HTML string from highlightCode()
 * @returns HTML with line numbers added
 */
export function addLineNumbers(highlightedHtml: string): string {
  // Split into lines and add line numbers
  const lines = highlightedHtml.split('\n');
  const totalLines = lines.length;
  const lineNumberWidth = totalLines.toString().length;

  return lines
    .map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(lineNumberWidth, ' ');
      return `<span class="line" data-line="${index + 1}"><span class="line-number">${lineNumber}</span>${line}</span>`;
    })
    .join('\n');
}
