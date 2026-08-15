import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(request: Request, path: string[]) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;

  const url = new URL(request.url);

  const backendUrl = new URL(`/${path.join('/')}`, API_BASE_URL);

  backendUrl.search = url.search;

  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('cookie');
  headers.delete('content-length');

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

async function handler(request: Request, context: RouteContext) {
  const { path } = await context.params;

  try {
    const response = await proxyRequest(request, path);

    const responseBody = await response.arrayBuffer();

    const responseHeaders = new Headers();

    const contentType = response.headers.get('content-type');

    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API PROXY ERROR:', error);

    return NextResponse.json(
      {
        message: 'Gagal menghubungi backend',
      },
      {
        status: 502,
      },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
