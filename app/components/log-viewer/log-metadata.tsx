import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Code, Eye, Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { Log } from '@/lib/supabase/types';

export interface LogMetadataProps {
  log: Log;
  commentCount: number;
}

export function LogMetadata({ log, commentCount }: LogMetadataProps) {
  const formattedDate = format(new Date(log.created_at), 'MMM dd, yyyy \'at\' h:mm a');
  const lineCount = log.metadata.lineCount || log.content.split('\n').length;

  return (
    <Card className="sticky top-32">
      <CardHeader>
        <CardTitle className="text-lg">Log Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detected Context */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="small-caps text-xs">Context</span>
          </div>
          <div className="ml-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20">
              {log.detected_context || 'Plain Text'}
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="small-caps text-xs">Created</span>
          </div>
          <div className="ml-6 text-sm font-display">{formattedDate}</div>
        </div>

        {/* Line Count */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="small-caps text-xs">Lines</span>
          </div>
          <div className="ml-6 text-sm font-display">{lineCount.toLocaleString()}</div>
        </div>

        {/* View Count */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="small-caps text-xs">Views</span>
          </div>
          <div className="ml-6 text-sm font-display">{log.view_count.toLocaleString()}</div>
        </div>

        {/* Comment Count */}
        {commentCount > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="small-caps text-xs">Comments</span>
            </div>
            <div className="ml-6 text-sm font-display">{commentCount.toLocaleString()}</div>
          </div>
        )}

        {/* Redaction Warning */}
        {log.redacted && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <span className="small-caps text-xs text-amber-600">Redacted</span>
                <p className="text-muted-foreground text-xs">
                  Sensitive data was automatically removed from this log for security.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Info (if available) */}
        {log.metadata.os && (
          <div className="pt-4 border-t border-border space-y-2">
            <span className="small-caps text-xs">System Info</span>
            <div className="text-sm text-muted-foreground space-y-1">
              {log.metadata.os && <div>OS: {log.metadata.os}</div>}
              {log.metadata.terminal && <div>Terminal: {log.metadata.terminal}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
