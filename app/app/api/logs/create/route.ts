import { NextRequest, NextResponse } from 'next/server';
import { createLog } from '@/lib/supabase/logs-service';
import { CreateLogRequest, CreateLogResponse } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateLogRequest = await request.json();

    const { content, metadata } = body;

    // Validate request
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create log in database
    const log = await createLog(content, metadata);

    // Build response
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    request.headers.get('origin') ||
                    `http://localhost:${process.env.PORT || 3000}`;

    const response: CreateLogResponse = {
      id: log.id,
      url: `${baseUrl}/log/${log.id}`,
      redacted: log.redacted,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/logs/create:', error);

    return NextResponse.json(
      {
        error: 'Failed to create log',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
