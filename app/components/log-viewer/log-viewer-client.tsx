'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LogDisplay } from './log-display';
import { LogMetadata } from './log-metadata';
import { ShareControls } from './share-controls';
import { CommentThread } from './comment-thread';
import type { Log } from '@/lib/supabase/types';

export interface LogViewerClientProps {
  log: Log;
  highlightedHtml: string;
  linesWithComments: number[];
  commentCount: number;
}

export function LogViewerClient({
  log,
  highlightedHtml,
  linesWithComments,
  commentCount,
}: LogViewerClientProps) {
  const [selectedLine, setSelectedLine] = React.useState<number | null>(null);

  // Fetch comment counts per line
  const { data: commentCounts } = useQuery({
    queryKey: ['comment-counts', log.id],
    queryFn: async () => {
      const res = await fetch(`/api/comments?logId=${log.id}`);
      if (!res.ok) return {};
      const data = await res.json();

      // Count comments per line number
      const counts: Record<number, number> = {};
      data.comments?.forEach((comment: any) => {
        counts[comment.line_number] = (counts[comment.line_number] || 0) + 1;
        // Count replies too
        if (comment.replies?.length > 0) {
          counts[comment.line_number] += comment.replies.length;
        }
      });
      return counts;
    },
  });

  return (
    <div className="relative">
      {/* Share Controls - Sticky at top */}
      <ShareControls
        logId={log.id}
        logContent={log.content}
        viewCount={log.view_count}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar - Metadata (hidden on mobile unless in a drawer) */}
          <aside className="hidden lg:block">
            <LogMetadata log={log} commentCount={commentCount} />
          </aside>

          {/* Main Log Display */}
          <main className="min-w-0">
            <LogDisplay
              log={log}
              highlightedHtml={highlightedHtml}
              onLineClick={setSelectedLine}
              linesWithComments={linesWithComments}
              commentCounts={commentCounts || {}}
            />

            {/* Mobile Metadata - Below log on mobile */}
            <div className="lg:hidden mt-8">
              <LogMetadata log={log} commentCount={commentCount} />
            </div>
          </main>
        </div>
      </div>

      {/* Comment Thread - Slide-in panel */}
      <CommentThread
        logId={log.id}
        lineNumber={selectedLine}
        onClose={() => setSelectedLine(null)}
      />

      {/* Overlay for mobile when comment thread is open */}
      {selectedLine !== null && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSelectedLine(null)}
        />
      )}
    </div>
  );
}
