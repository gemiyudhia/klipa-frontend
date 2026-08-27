import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error=google_oauth_failed', request.url),
    );
  }

  const backendUrl = new URL('/auth/google/callback', API_BASE_URL);

  backendUrl.searchParams.set('code', code);

  if (url.searchParams.has('scope')) {
    backendUrl.searchParams.set('scope', url.searchParams.get('scope')!);
  }

  if (url.searchParams.has('authuser')) {
    backendUrl.searchParams.set('authuser', url.searchParams.get('authuser')!);
  }

  if (url.searchParams.has('prompt')) {
    backendUrl.searchParams.set('prompt', url.searchParams.get('prompt')!);
  }

  const response = await fetch(backendUrl, {
    method: 'GET',
    redirect: 'manual',
    cache: 'no-store',
  });

  const location = response.headers.get('location');

  if (location) {
    return NextResponse.redirect(location);
  }

  return NextResponse.redirect(
    new URL('/sign-in?error=google_oauth_failed', request.url),
  );
}
