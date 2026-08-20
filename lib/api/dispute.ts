import apiClient from './client';

export interface Dispute {
  id: string;
  clipId: string;
  clipperId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  resolutionNote: string | null;
  createdAt: string;
  clip: {
    id: string;
    title: string;
    status: string;
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

export async function createDispute(clipId: string, reason: string) {
  const { data } = await apiClient.post('/dispute', { clipId, reason });
  return data;
}

export async function getMyDisputes(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Dispute>>(
    '/dispute/mine',
    {
      params: { page, limit },
    },
  );
  return data;
}

export async function getPendingDisputes(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Dispute>>(
    '/dispute/pending',
    {
      params: { page, limit },
    },
  );
  return data;
}

export interface ResolveDisputePayload {
  status: 'APPROVED' | 'REJECTED';
  resolutionNote?: string;
}

export async function resolveDispute(
  disputeId: string,
  payload: ResolveDisputePayload,
) {
  const { data } = await apiClient.patch(
    `/dispute/${disputeId}/resolve`,
    payload,
  );
  return data;
}