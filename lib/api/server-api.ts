import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;

  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });
}
