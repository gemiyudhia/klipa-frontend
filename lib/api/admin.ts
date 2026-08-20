import apiClient from './client';

export interface Analytics {
  users: { total: number; byRole: { role: string; count: number }[] };
  campaign: { total: number; byStatus: { status: string; count: number }[] };
  clips: { total: number; byStatus: { status: string; count: number }[] };
  pendingActions: { disputes: number; withdrawals: number };
  revenue: { total: number; bySource: { source: string; amount: number }[] };
  transactionVolume: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  isSuspended: boolean;
  suspendedReason: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getAnalytics() {
  const { data } = await apiClient.get<Analytics>('/admin/analytics');
  return data;
}

export async function getAllUsers(params: {
  page?: number;
  role?: string;
  search?: string;
}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminUser>>(
    '/admin/users',
    { params },
  );
  return data;
}

export async function suspendUser(userId: string, reason: string) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/suspend`, {
    reason,
  });
  return data;
}

export async function unsuspendUser(userId: string) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/unsuspend`);
  return data;
}

export async function closeCampaign(campaignId: string, reason: string) {
  const { data } = await apiClient.patch(
    `/admin/campaign/${campaignId}/close`,
    { reason },
  );
  return data;
}
