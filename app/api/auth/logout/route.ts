import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {});
  }

  const response = NextResponse.json({ message: 'Logout berhasil' });
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  response.cookies.delete('userRole');
  response.cookies.delete('isRoleSelected');

  return response;
}
