import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function proxyRequest(request: Request, accessToken: string | undefined) {
  const url = new URL(request.url);

  const path = url.pathname
    .replace('/api/proxy/', '')
    .split('/')
    .filter(Boolean);

  const backendUrl = new URL(`/${path.join('/')}`, API_BASE_URL);

  backendUrl.search = url.search;

  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('cookie');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let body: ArrayBuffer | undefined;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  return fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });
}

async function handler(request: Request) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value;

  const refreshToken = cookieStore.get('refreshToken')?.value;

  let response = await proxyRequest(request, accessToken);

  if (response.status === 401 && refreshToken) {
    const tokens = await refreshAccessToken(refreshToken);

    if (tokens) {
      accessToken = tokens.access_token;

      response = await proxyRequest(request, accessToken);

      const body = await response.arrayBuffer();

      const result = new NextResponse(body, {
        status: response.status,
        headers: {
          'Content-Type':
            response.headers.get('Content-Type') || 'application/json',
        },
      });

      result.cookies.set({
        name: 'accessToken',
        value: tokens.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      });

      result.cookies.set({
        name: 'refreshToken',
        value: tokens.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return result;
    }
  }

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') || 'application/json',
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
