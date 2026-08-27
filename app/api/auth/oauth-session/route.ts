import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: 'Token tidak lengkap' },
        { status: 400 },
      );
    }

    // Validasi access token ke backend
    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!meRes.ok) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 },
      );
    }

    const profile = await meRes.json();

    const response = NextResponse.json(profile);

    // Simpan token di domain Vercel sebagai HTTP-only cookie
    response.cookies.set('accessToken', accessToken, COOKIE_OPTIONS);

    response.cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);

    // Cookie yang memang perlu dibaca client
    response.cookies.set('userRole', profile.role ?? '', {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    });

    response.cookies.set(
      'isRoleSelected',
      String(profile.isRoleSelected ?? false),
      {
        ...COOKIE_OPTIONS,
        httpOnly: false,
      },
    );

    return response;
  } catch (error) {
    console.error('OAUTH SESSION ERROR:', error);

    return NextResponse.json(
      { message: 'Gagal membuat session' },
      { status: 500 },
    );
  }
}
