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
