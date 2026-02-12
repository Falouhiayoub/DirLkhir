import { NextRequest, NextResponse } from 'next/server';
import { loginUser, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[api/auth/login] body:', body);
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login user
    const user = await loginUser(email, password);

    // Set session cookie
    await setSessionCookie(user.id);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    console.error('[api/auth/login] error:', message);
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
