import { NextRequest, NextResponse } from 'next/server';
import { listLogs } from '@/lib/supabase/logs-service';
import { ListLogsResponse } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const context = searchParams.get('context') || undefined;
    const search = searchParams.get('search') || undefined;

    // Validate pagination params
    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Fetch logs from database
    const { logs, total } = await listLogs({
      page,
      limit,
      context,
      search,
    });

    const response: ListLogsResponse = {
      logs,
      total,
      page,
      limit,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/logs/list:', error);

    return NextResponse.json(
      {
        error: 'Failed to list logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
