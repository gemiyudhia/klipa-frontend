import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET() {
  return NextResponse.redirect(`${API_BASE_URL}/auth/google`);
}
