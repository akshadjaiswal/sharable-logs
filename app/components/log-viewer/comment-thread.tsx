'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import type { Comment } from '@/lib/supabase/types';

const commentSchema = z.object({
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  content: z.string().min(1, 'Comment is required'),
});

type CommentFormData = z.infer<typeof commentSchema>;

export interface CommentThreadProps {
  logId: string;
  lineNumber: number | null;
  onClose: () => void;
}

export function CommentThread({ logId, lineNumber, onClose }: CommentThreadProps) {
  const queryClient = useQueryClient();
  const [replyTo, setReplyTo] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // Fetch comments for this line
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', logId, lineNumber],
    queryFn: async () => {
      if (!lineNumber) return { comments: [] };
      const response = await fetch(`/api/comments?logId=${logId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      // Filter for this line number
      return {
        comments: data.comments.filter((c: Comment) => c.line_number === lineNumber),
      };
    },
    enabled: lineNumber !== null,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData & { parentId?: string }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId,
          lineNumber,
          ...data,
        }),
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', logId] });
      reset();
      setReplyTo(null);
      toast.success('Comment added!');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate({
      ...data,
      parentId: replyTo || undefined,
    });
  };

  if (lineNumber === null) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold">
            Line {lineNumber}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : commentsData?.comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first!</p>
          </div>
        ) : (
          commentsData?.comments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={() => setReplyTo(comment.id)}
            />
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="border-t border-border p-4 bg-muted/30">
        {replyTo && (
          <div className="mb-3 text-sm text-muted-foreground flex items-center justify-between">
            <span>Replying to comment...</span>
            <button onClick={() => setReplyTo(null)} className="text-accent hover:underline">
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              {...register('authorName')}
              placeholder="Your name"
              className="bg-background"
            />
            {errors.authorName && (
              <p className="text-sm text-red-600 mt-1">{errors.authorName.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('authorEmail')}
              type="email"
              placeholder="Email (optional)"
              className="bg-background"
            />
            {errors.authorEmail && (
              <p className="text-sm text-red-600 mt-1">{errors.authorEmail.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register('content')}
              placeholder="Add a comment..."
              className="bg-background min-h-[80px]"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-full"
            disabled={createCommentMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-medium text-accent text-sm">
          {comment.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{comment.author_name}</div>
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
        </div>
      </div>
      <div className="ml-10 text-sm whitespace-pre-wrap">{comment.content}</div>
      <div className="ml-10">
        <button
          onClick={onReply}
          className="text-xs text-accent hover:underline"
        >
          Reply
        </button>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 pl-4 border-l-2 border-border space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
