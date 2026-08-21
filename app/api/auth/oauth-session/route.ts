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
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { message: 'Token tidak lengkap' },
      { status: 400 },
    );
  }

  const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!meRes.ok) {
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
  }

  const profile = await meRes.json();

  const response = NextResponse.json(profile);
  response.cookies.set('accessToken', accessToken, COOKIE_OPTIONS);
  response.cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
  response.cookies.set('userRole', profile.role, {
    ...COOKIE_OPTIONS,
    httpOnly: false,
  });
  response.cookies.set(
    'isRoleSelected',
    String(profile.isRoleSelected ?? true),
    {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    },
  );

  return response;
}
