import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function handler(
  request: Request,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;

  const url = new URL(request.url);

  const backendUrl = new URL(`/${path.join('/')}`, API_BASE_URL);

  backendUrl.search = url.search;

  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('cookie');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let body: BodyInit | undefined;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  const responseBody = await response.arrayBuffer();

  return new NextResponse(responseBody, {
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
