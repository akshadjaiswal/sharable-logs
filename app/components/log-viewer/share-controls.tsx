'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ShareControlsProps {
  logId: string;
  logContent: string;
  viewCount: number;
}

export function ShareControls({ logId, logContent, viewCount }: ShareControlsProps) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/log/${logId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-${logId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Log downloaded!');
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewCount} {viewCount === 1 ? 'view' : 'views'}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyLink}
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
