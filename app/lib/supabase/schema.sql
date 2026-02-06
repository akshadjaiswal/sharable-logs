-- LogShare Database Schema
-- Run this in Supabase SQL Editor

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  detected_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_private BOOLEAN NOT NULL DEFAULT false,
  redacted BOOLEAN NOT NULL DEFAULT false
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID NOT NULL REFERENCES logs(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS logs_created_at_idx ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS logs_detected_context_idx ON logs(detected_context);
CREATE INDEX IF NOT EXISTS comments_log_id_idx ON comments(log_id);
CREATE INDEX IF NOT EXISTS comments_line_number_idx ON comments(log_id, line_number);

-- Enable Row Level Security
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS public_read_logs ON logs;
DROP POLICY IF EXISTS public_create_logs ON logs;
DROP POLICY IF EXISTS public_update_logs ON logs;
DROP POLICY IF EXISTS public_delete_logs ON logs;
DROP POLICY IF EXISTS public_read_comments ON comments;
DROP POLICY IF EXISTS public_create_comments ON comments;

-- RLS Policies for logs (public access for MVP)
CREATE POLICY public_read_logs ON logs
  FOR SELECT
  USING (true);

CREATE POLICY public_create_logs ON logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY public_update_logs ON logs
  FOR UPDATE
  USING (true);

CREATE POLICY public_delete_logs ON logs
  FOR DELETE
  USING (true);

-- RLS Policies for comments (public access for MVP)
CREATE POLICY public_read_comments ON comments
  FOR SELECT
  USING (true);

CREATE POLICY public_create_comments ON comments
  FOR INSERT
  WITH CHECK (true);
