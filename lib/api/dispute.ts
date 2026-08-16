import apiClient from './client';

export async function createDispute(clipId: string, reason: string) {
  const { data } = await apiClient.post('/dispute', { clipId, reason });
  return data;
}
