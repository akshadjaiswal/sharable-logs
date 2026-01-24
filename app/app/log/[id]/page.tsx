import { notFound } from 'next/navigation';
import { LogViewerClient } from '@/components/log-viewer/log-viewer-client';
import { getLog } from '@/lib/supabase/logs-service';
import {
  getCommentCount,
  getLinesWithComments,
} from '@/lib/supabase/comments-service';
import { highlightCode } from '@/lib/syntax-highlighting';
import { contextToLanguage } from '@/lib/detect-context';

export default async function LogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch log from database
  const log = await getLog(id);

  if (!log) {
    notFound();
  }

  // Get syntax highlighting language
  const language = contextToLanguage(log.detected_context || 'Plain Text');

  // Highlight code server-side
  const highlightedHtml = await highlightCode(log.content, language);

  // Get comment metadata
  const [commentCount, linesWithComments] = await Promise.all([
    getCommentCount(id),
    getLinesWithComments(id),
  ]);

  return (
    <LogViewerClient
      log={log}
      highlightedHtml={highlightedHtml}
      linesWithComments={linesWithComments}
      commentCount={commentCount}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getLog(id);

  if (!log) {
    return {
      title: 'Log Not Found',
    };
  }

  const preview = log.content.split('\n')[0].substring(0, 100);

  return {
    title: `${log.detected_context || 'Log'} - LogShare`,
    description: preview,
  };
}
