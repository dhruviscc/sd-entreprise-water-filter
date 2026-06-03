
import { loginUser } from '@/modules/auth/authService';
import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/modules/auth/authCookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);
    const session = result.session;

    if (!session?.access_token || !session?.refresh_token) {
      return NextResponse.json(
        { error: 'Invalid login response from auth provider.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: result.user,
      },
      { status: 200 }
    );

    setAuthCookies(
      response,
      session.access_token,
      session.refresh_token,
      session.expires_in ?? 86400 // 1 day
     );

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);

    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status }
    );
  }
}
