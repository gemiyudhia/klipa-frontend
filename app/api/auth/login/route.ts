import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const tokens = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json(tokens, {
        status: loginResponse.status,
      });
    }

    const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
      cache: 'no-store',
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      return NextResponse.json(profile, {
        status: profileResponse.status,
      });
    }

    const response = NextResponse.json({
      user: profile,
    });

    response.cookies.set({
      name: 'accessToken',
      value: tokens.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    response.cookies.set({
      name: 'refreshToken',
      value: tokens.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return NextResponse.json(
      {
        message: 'Gagal login',
      },
      {
        status: 500,
      },
    );
  }
}
