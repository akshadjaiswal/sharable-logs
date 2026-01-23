import { createClient } from '@/lib/supabase/server';
import { Log, LogInsert, ListLogsParams } from './types';
import { detectContext, contextToLanguage } from '../detect-context';
import { redactSensitive } from '../redact-sensitive';

/**
 * Creates a new log entry in the database
 * @param content - The raw log content
 * @param metadata - Optional metadata object
 * @returns The created log with ID
 */
export async function createLog(
  content: string,
  metadata?: Record<string, any>
): Promise<Log> {
  const supabase = await createClient();

  // Detect context from content
  const detectedContext = detectContext(content);

  // Redact sensitive information
  const { redacted: redactedContent, hadSensitiveData } = redactSensitive(content);

  // Count lines
  const lineCount = content.split('\n').length;

  // Prepare log data
  const logData: LogInsert = {
    content: redactedContent,
    metadata: {
      ...metadata,
      lineCount,
      originalLength: content.length,
      redactedLength: redactedContent.length,
    },
    detected_context: detectedContext,
    redacted: hadSensitiveData,
    is_private: false,
  };

  // Insert into database
  const { data, error } = await supabase
    .from('logs')
    .insert(logData)
    .select()
    .single();

  if (error) {
    console.error('Error creating log:', error);
    throw new Error(`Failed to create log: ${error.message}`);
  }

  return data as Log;
}

/**
 * Retrieves a log by ID
 * @param id - The log UUID
 * @returns The log object or null if not found
 */
export async function getLog(id: string): Promise<Log | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching log:', error);
    throw new Error(`Failed to fetch log: ${error.message}`);
  }

  return data as Log;
}

/**
 * Lists logs with optional filtering and pagination
 * @param params - Query parameters (page, limit, context, search)
 * @returns Array of logs with total count
 */
export async function listLogs(
  params: ListLogsParams = {}
): Promise<{ logs: Log[]; total: number }> {
  const supabase = await createClient();
  const { page = 1, limit = 20, context, search } = params;

  // Calculate offset
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase.from('logs').select('*', { count: 'exact' });

  // Filter by context if provided
  if (context) {
    query = query.eq('detected_context', context);
  }

  // Search in content if provided
  if (search) {
    query = query.ilike('content', `%${search}%`);
  }

  // Order by created_at desc
  query = query.order('created_at', { ascending: false });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error listing logs:', error);
    throw new Error(`Failed to list logs: ${error.message}`);
  }

  return {
    logs: (data as Log[]) || [],
    total: count || 0,
  };
}

/**
 * Increments the view count for a log
 * @param id - The log UUID
 */
export async function incrementViewCount(id: string): Promise<void> {
  const supabase = await createClient();

  // Get current count
  const { data: log } = await supabase
    .from('logs')
    .select('view_count')
    .eq('id', id)
    .single();

  if (!log) return;

  // Increment
  const { error } = await supabase
    .from('logs')
    .update({ view_count: log.view_count + 1 })
    .eq('id', id);

  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * Deletes a log by ID
 * @param id - The log UUID
 */
export async function deleteLog(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('logs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting log:', error);
    throw new Error(`Failed to delete log: ${error.message}`);
  }
}

/**
 * Get logs grouped by detected context (for dashboard statistics)
 */
export async function getLogStatsByContext(): Promise<
  Array<{ context: string; count: number }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('logs')
    .select('detected_context')
    .not('detected_context', 'is', null);

  if (error) {
    console.error('Error fetching log stats:', error);
    return [];
  }

  // Group by context and count
  const contextCounts: Record<string, number> = {};
  data.forEach((log) => {
    const context = log.detected_context || 'Unknown';
    contextCounts[context] = (contextCounts[context] || 0) + 1;
  });

  return Object.entries(contextCounts)
    .map(([context, count]) => ({ context, count }))
    .sort((a, b) => b.count - a.count);
}
