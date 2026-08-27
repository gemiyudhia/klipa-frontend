import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const code = url.searchParams.get('code');
    const redirect = url.searchParams.get('redirect') || '/explore';

    if (!code) {
      return NextResponse.redirect(
        new URL('/sign-in?error=missing_oauth_code', request.url),
      );
    }

    // Tukarkan temporary code ke backend
    const tokenResponse = await fetch(`${API_BASE_URL}/auth/oauth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      console.error('OAuth exchange failed:', await tokenResponse.text());

      return NextResponse.redirect(
        new URL('/sign-in?error=oauth_exchange_failed', request.url),
      );
    }

    const { accessToken, refreshToken } = await tokenResponse.json();

    // Validasi token ke backend
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!meResponse.ok) {
      return NextResponse.redirect(
        new URL('/sign-in?error=invalid_oauth_session', request.url),
      );
    }

    const profile = await meResponse.json();

    // Browser sekarang menerima cookie dari Vercel
    const response = NextResponse.redirect(new URL(redirect, request.url));

    response.cookies.set('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('OAUTH SESSION ERROR:', error);

    return NextResponse.redirect(
      new URL('/sign-in?error=oauth_session_failed', request.url),
    );
  }
}
