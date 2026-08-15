import apiClient from './client';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  rewardPerClip: number;
  totalBudget: number;
  remainingBudget: number;
  vodUrl: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'BANNED';
  deadline: string;
  creatorId: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getPublicCampaigns(page = 1, limit = 12) {
  const { data } = await apiClient.get<PaginatedResponse<Campaign>>(
    '/campaign',
    {
      params: { page, limit },
    },
  );
  return data;
}

export async function getCampaignDetail(id: string) {
  const { data } = await apiClient.get<Campaign>(`/campaign/${id}`);
  return data;
}
