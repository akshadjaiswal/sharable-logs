import { codeToHtml } from 'shiki';

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
