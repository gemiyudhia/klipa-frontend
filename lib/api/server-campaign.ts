import { cookies } from 'next/headers';
import type { Campaign } from './campaign';
import { serverApiFetch } from './server-api';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getCampaignsServer(page = 1, limit = 12) {
  const response = await serverApiFetch(
    `/campaign?page=${page}&limit=${limit}`,
  );

  if (!response.ok) {
    const body = await response.text();

    console.error('CAMPAIGN ERROR:', body);

    throw new Error(`Failed to fetch campaigns: ${response.status}`);
  }

  return response.json() as Promise<PaginatedResponse<Campaign>>;
}

export async function getCampaignDetailServer(campaignId: string) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('UNAUTHORIZED');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/campaign/${campaignId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch campaign: ${response.status}`);
  }

  return response.json() as Promise<Campaign>;
}
