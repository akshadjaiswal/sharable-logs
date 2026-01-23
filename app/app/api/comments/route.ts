import { NextRequest, NextResponse } from 'next/server';
import {
  createComment,
  getCommentsByLogId,
} from '@/lib/supabase/comments-service';
import { CreateCommentRequest } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json();

    const { logId, lineNumber, content, authorName, authorEmail, parentId } = body;

    // Validate request
    if (!logId || typeof logId !== 'string') {
      return NextResponse.json(
        { error: 'logId is required and must be a string' },
        { status: 400 }
      );
    }

    if (typeof lineNumber !== 'number' || lineNumber < 1) {
      return NextResponse.json(
        { error: 'lineNumber is required and must be a positive number' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!authorName || typeof authorName !== 'string' || authorName.trim().length === 0) {
      return NextResponse.json(
        { error: 'authorName is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create comment in database
    const comment = await createComment(
      logId,
      lineNumber,
      content,
      authorName,
      authorEmail,
      parentId
    );

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);

    return NextResponse.json(
      {
        error: 'Failed to create comment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const logId = searchParams.get('logId');

    // Validate request
    if (!logId) {
      return NextResponse.json(
        { error: 'logId query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch comments from database
    const comments = await getCommentsByLogId(logId);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/comments:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch comments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
