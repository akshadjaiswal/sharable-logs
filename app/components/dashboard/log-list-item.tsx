'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Eye, FileText, Link as LinkIcon, Download, MessageSquare, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@/components/ui/dialog';
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

  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/logs/${log.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete log');
      }

      return response.json();
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['logs'] });

      // Snapshot previous values (for rollback on error)
      const previousLogs = queryClient.getQueriesData({ queryKey: ['logs'] });

      // Optimistically update: remove the deleted log from all query caches
      queryClient.setQueriesData<any>(
        { queryKey: ['logs'] },
        (old) => {
          if (!old) return old;

          // Handle infinite query structure
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                logs: page.logs.filter((item: Log) => item.id !== log.id),
                total: page.total - 1,
              })),
            };
          }

          return old;
        }
      );

      // Return context for rollback
      return { previousLogs };
    },
    onError: (error: Error, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousLogs) {
        context.previousLogs.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to delete log. Please try again.');
    },
    onSuccess: () => {
      // Invalidate to ensure fresh data (with wildcard)
      queryClient.invalidateQueries({
        queryKey: ['logs'],
        exact: false
      });
      toast.success('Log deleted successfully');
    },
  });

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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete log"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Log?"
        description="This action cannot be undone. This will permanently delete this log and all associated comments."
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
}
