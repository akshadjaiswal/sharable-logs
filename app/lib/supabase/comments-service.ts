import { createClient } from '@/lib/supabase/server';
import { Comment, CommentInsert } from './types';

/**
 * Creates a new comment on a log
 * @param logId - The log UUID
 * @param lineNumber - The line number being commented on
 * @param content - The comment content
 * @param authorName - Name of the comment author
 * @param authorEmail - Optional email of the author
 * @param parentId - Optional parent comment ID for replies
 * @returns The created comment
 */
export async function createComment(
  logId: string,
  lineNumber: number,
  content: string,
  authorName: string,
  authorEmail?: string,
  parentId?: string
): Promise<Comment> {
  const supabase = await createClient();

  const commentData: CommentInsert = {
    log_id: logId,
    line_number: lineNumber,
    content,
    author_name: authorName,
    author_email: authorEmail || null,
    parent_id: parentId || null,
  };

  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return data as Comment;
}

/**
 * Retrieves all comments for a specific log
 * @param logId - The log UUID
 * @returns Array of comments with nested replies
 */
export async function getCommentsByLogId(logId: string): Promise<Comment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('log_id', logId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  const comments = data as Comment[];

  // Organize comments into a tree structure (parent comments with nested replies)
  return organizeCommentsIntoTree(comments);
}

/**
 * Retrieves comments for a specific line number
 * @param logId - The log UUID
 * @param lineNumber - The line number
 * @returns Array of comments for that line
 */
export async function getCommentsByLine(
  logId: string,
  lineNumber: number
): Promise<Comment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('log_id', logId)
    .eq('line_number', lineNumber)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments by line:', error);
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  const comments = data as Comment[];
  return organizeCommentsIntoTree(comments);
}

/**
 * Deletes a comment by ID
 * @param id - The comment UUID
 */
export async function deleteComment(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}

/**
 * Gets the total comment count for a log
 * @param logId - The log UUID
 * @returns Total number of comments
 */
export async function getCommentCount(logId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('log_id', logId);

  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Organizes flat comments array into nested tree structure
 * @param comments - Flat array of comments
 * @returns Array of top-level comments with nested replies
 */
function organizeCommentsIntoTree(comments: Comment[]): Comment[] {
  // Create a map of comment ID to comment object
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // Initialize all comments with empty replies array
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Build the tree structure
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parent_id) {
      // This is a reply, add it to parent's replies
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    } else {
      // This is a top-level comment
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

/**
 * Gets lines that have comments (for displaying comment indicators)
 * @param logId - The log UUID
 * @returns Array of line numbers that have comments
 */
export async function getLinesWithComments(logId: string): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('line_number')
    .eq('log_id', logId);

  if (error) {
    console.error('Error fetching lines with comments:', error);
    return [];
  }

  // Get unique line numbers
  const lineNumbers = [...new Set(data.map((c) => c.line_number))];
  return lineNumbers.sort((a, b) => a - b);
}
