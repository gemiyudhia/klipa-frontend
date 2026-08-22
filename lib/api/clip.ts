import apiClient from './client';

export interface CreateClipPayload {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  campaignId: string;
}

export async function submitClip(payload: CreateClipPayload) {
  const { data } = await apiClient.post('/clip', payload);
  return data;
}

export interface Clip {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  feedback: string | null;
  platformFeeAmount: number | null;
  payoutAmount: number | null;
  campaignId: string;
  clipperId: string;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
  };
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

export async function getMyClips(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Clip>>('/clip/mine', {
    params: { page, limit },
  });
  return data;
}

export async function getClipsByCampaign(
  campaignId: string,
  page = 1,
  limit = 20,
) {
  const { data } = await apiClient.get<PaginatedResponse<Clip>>(
    `/clip/by-campaign/${campaignId}`,
    { params: { page, limit } },
  );
  return data;
}

export interface ReviewClipPayload {
  status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  feedback?: string;
}

export async function reviewClip(clipId: string, payload: ReviewClipPayload) {
  const { data } = await apiClient.patch(`/clip/${clipId}/review`, payload);
  return data;
}
