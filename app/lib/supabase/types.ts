// Database types for LogShare

export interface Log {
  id: string;
  content: string;
  metadata: LogMetadata;
  detected_context: string | null;
  created_at: string;
  expires_at: string | null;
  view_count: number;
  is_private: boolean;
  redacted: boolean;
}

export interface LogMetadata {
  terminal?: string;
  os?: string;
  context?: string;
  lineCount?: number;
  systemInfo?: string;
  [key: string]: any;
}

export interface Comment {
  id: string;
  log_id: string;
  line_number: number;
  content: string;
  author_name: string;
  author_email: string | null;
  created_at: string;
  parent_id: string | null;
  replies?: Comment[]; // For nested comments
}

export interface CreateLogRequest {
  content: string;
  metadata?: Partial<LogMetadata>;
}

export interface CreateLogResponse {
  id: string;
  url: string;
  redacted: boolean;
}

export interface CreateCommentRequest {
  logId: string;
  lineNumber: number;
  content: string;
  authorName: string;
  authorEmail?: string;
  parentId?: string;
}

export interface ListLogsParams {
  page?: number;
  limit?: number;
  context?: string;
  search?: string;
}

export interface ListLogsResponse {
  logs: Log[];
  total: number;
  page: number;
  limit: number;
}

// Helper type for database inserts (omits auto-generated fields)
export type LogInsert = Omit<Log, 'id' | 'created_at' | 'view_count'> & {
  id?: string;
  created_at?: string;
  view_count?: number;
};

export type CommentInsert = Omit<Comment, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
