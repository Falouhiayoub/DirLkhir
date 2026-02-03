import { NextRequest, NextResponse } from 'next/server';
import { assignHelperToNeed, getHelpersForNeed } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const needId = parseInt(id);

    if (isNaN(needId)) {
      return NextResponse.json({ error: 'Invalid need ID' }, { status: 400 });
    }

    const helpers = await getHelpersForNeed(needId);
    return NextResponse.json({ helpers }, { status: 200 });
  } catch (error) {
    console.log('[v0] Error fetching helpers:', error);
    return NextResponse.json({ error: 'Failed to fetch helpers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const needId = parseInt(id);

    if (isNaN(needId)) {
      return NextResponse.json({ error: 'Invalid need ID' }, { status: 400 });
    }

    const { message } = await request.json();

    const helper = await assignHelperToNeed(needId, user.id, message);
    return NextResponse.json({ helper }, { status: 201 });
  } catch (error) {
    console.log('[v0] Error assigning helper:', error);
    const message = error instanceof Error ? error.message : 'Failed to assign helper';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
