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
      // Parse Shiki HTML to extract individual line HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(highlightedHtml, 'text/html');
      const codeLines = doc.querySelectorAll('.line');

      if (codeLines.length === 0) {
        // Fallback: try to find any code element
        const codeElement = doc.querySelector('code');
        if (codeElement) {
          // Split by line breaks in the HTML
          return codeElement.innerHTML.split('\n').map(line => line.trim());
        }
        return lines;
      }

      return Array.from(codeLines).map(line => line.innerHTML);
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
