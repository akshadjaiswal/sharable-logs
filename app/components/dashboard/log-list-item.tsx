'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Eye, FileText, Link as LinkIcon, Download, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import type { Log } from '@/lib/supabase/types';

export interface LogListItemProps {
  log: Log;
}

export function LogListItem({ log }: LogListItemProps) {
  const timeAgo = formatDistanceToNow(new Date(log.created_at), {
    addSuffix: true,
  });

  const firstLine = log.content.split('\n')[0];
  const preview = firstLine.length > 100 ? `${firstLine.substring(0, 100)}...` : firstLine;
  const lineCount = log.metadata.lineCount || log.content.split('\n').length;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/log/${log.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const blob = new Blob([log.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-${log.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Log downloaded!');
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <Link href={`/log/${log.id}`} className="block p-6">
        {/* Top Row - Context Badge, Time, Views */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            {log.detected_context || 'Plain Text'}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{log.view_count}</span>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-4">
          <p className="font-mono text-sm text-foreground line-clamp-2">
            {preview}
          </p>
        </div>

        {/* Bottom Row - Stats and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{lineCount.toLocaleString()} lines</span>
            </div>
            {/* Future: Show comment count if available */}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
