import { NextRequest, NextResponse } from 'next/server';
import { getNeedsByNeighborhood, createNeed } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const neighborhood = searchParams.get('neighborhood');

    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood parameter is required' },
        { status: 400 }
      );
    }

    const needs = await getNeedsByNeighborhood(neighborhood);
    return NextResponse.json({ needs }, { status: 200 });
  } catch (error) {
    console.log('[v0] Error fetching needs:', error);
    return NextResponse.json({ error: 'Failed to fetch needs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { title, description, category, expiresAt } = await request.json();

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const need = await createNeed(
      user.id,
      title,
      description,
      category,
      user.neighborhood,
      expiresAt
    );

    return NextResponse.json({ need }, { status: 201 });
  } catch (error) {
    console.log('[v0] Error creating need:', error);
    return NextResponse.json({ error: 'Failed to create need' }, { status: 500 });
  }
}
