import { NextRequest, NextResponse } from 'next/server';
import { getLog, incrementViewCount, deleteLog } from '@/lib/supabase/logs-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid log ID format' },
        { status: 400 }
      );
    }

    // Fetch log from database
    const log = await getLog(id);

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    // Increment view count asynchronously (don't wait for it)
    incrementViewCount(id).catch((error) => {
      console.error('Failed to increment view count:', error);
    });

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/logs/[id]:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch log',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid log ID format' },
        { status: 400 }
      );
    }

    // Delete log using existing service function
    await deleteLog(id);

    return NextResponse.json(
      { success: true, id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/logs/[id]:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete log',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
