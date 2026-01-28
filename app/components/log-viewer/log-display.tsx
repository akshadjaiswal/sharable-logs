'use client';

import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Log } from '@/lib/supabase/types';

export interface LogDisplayProps {
  log: Log;
  highlightedHtml: string;
  onLineClick: (lineNumber: number) => void;
  linesWithComments: number[];
  commentCounts?: Record<number, number>;
}

/**
 * Extracts content from Shiki line spans, handling nested spans correctly.
 * Shiki wraps each line in <span class="line">...</span>, but the content inside
 * can have multiple nested spans for syntax highlighting. This function uses
 * balanced span counting to extract the complete inner HTML.
 */
function extractShikiLines(html: string): string[] {
  const lines: string[] = [];
  const lineRegex = /<span class="line"[^>]*>/g;
  let match;

  while ((match = lineRegex.exec(html)) !== null) {
    const startPos = match.index + match[0].length;
    let depth = 1;
    let pos = startPos;

    // Count opening and closing spans to find matching closing tag
    while (depth > 0 && pos < html.length) {
      const nextOpen = html.indexOf('<span', pos);
      const nextClose = html.indexOf('</span>', pos);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 5; // Move past '<span'
      } else {
        depth--;
        pos = nextClose + 7; // Move past '</span>'
      }
    }

    // Extract content between opening and closing tags
    if (depth === 0) {
      lines.push(html.substring(startPos, pos - 7));
    }
  }

  return lines;
}

export function LogDisplay({
  log,
  highlightedHtml,
  onLineClick,
  linesWithComments,
  commentCounts = {},
}: LogDisplayProps) {
  const lines = log.content.split('\n');

  // Parse highlighted HTML into individual line HTML strings
  const highlightedLines = React.useMemo(() => {
    if (!highlightedHtml) return lines;

    try {
      // Extract lines using balanced span matching
      const extracted = extractShikiLines(highlightedHtml);

      if (extracted.length > 0) {
        return extracted;
      }

      // Fallback 1: Try to extract from <code> block
      const codeMatch = highlightedHtml.match(/<code[^>]*>(.*?)<\/code>/s);
      if (codeMatch) {
        const codeContent = codeMatch[1];
        return extractShikiLines(codeContent);
      }

      // Final fallback: use original lines
      return lines;
    } catch (error) {
      console.error('Failed to parse highlighted HTML:', error);
      return lines;
    }
  }, [highlightedHtml, lines]);

  React.useEffect(() => {
    // Handle URL anchors (#L42)
    if (window.location.hash) {
      const lineNumber = parseInt(window.location.hash.replace('#L', ''), 10);
      if (!isNaN(lineNumber)) {
        const lineElement = document.querySelector(`[data-line="${lineNumber}"]`);
        if (lineElement) {
          setTimeout(() => {
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            lineElement.classList.add('bg-accent/10', 'border-l-2', 'border-accent');
          }, 100);
        }
      }
    }
  }, []);

  const handleLineClick = (lineNumber: number) => {
    // Update URL hash
    window.history.pushState(null, '', `#L${lineNumber}`);
    onLineClick(lineNumber);
  };

  return (
    <Card className="overflow-hidden shadow-lg border-2">
      <div className="bg-muted/30 border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono">{lines.length} lines</span>
          {log.detected_context && (
            <>
              <span>•</span>
              <span>{log.detected_context}</span>
            </>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="font-mono text-[15px] leading-7 p-2">
          {lines.map((_, index) => {
            const lineNumber = index + 1;
            const hasComments = linesWithComments.includes(lineNumber);

            return (
              <div
                key={lineNumber}
                data-line={lineNumber}
                className="group flex hover:bg-accent/5 hover:shadow-sm transition-all cursor-pointer border-l-2 border-transparent hover:border-accent/50 rounded-sm"
                onClick={() => handleLineClick(lineNumber)}
              >
                {/* Line number */}
                <div className="sticky left-0 bg-background group-hover:bg-accent/5 z-10 flex items-center gap-2 px-4 py-1 text-muted-foreground select-none min-w-[120px] border-r border-border">
                  <span className="text-right w-12 font-medium">{lineNumber}</span>
                  {hasComments && commentCounts[lineNumber] && (
                    <span className="comment-badge">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="count">{commentCounts[lineNumber]}</span>
                    </span>
                  )}
                </div>

                {/* Line content */}
                <div className="flex-1 px-4 py-1 overflow-x-auto">
                  <div
                    className="log-line-content"
                    dangerouslySetInnerHTML={{ __html: highlightedLines[index] || lines[index] }}
                  /></div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// Simple Card component if not using the UI Card
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}
