import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get('accessToken')?.value ?? null;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();

  return cookieStore.get('refreshToken')?.value ?? null;
}
