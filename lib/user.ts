import type { AuthUser } from '@/store/authStore';
import apiClient from './api/client';

export interface TopUpResponse {
  id: string;
  balance: number;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string;
}

export async function topUp(amount: number) {
  const { data } = await apiClient.patch<TopUpResponse>('/users/me/topup', {
    amount,
  });
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await apiClient.patch<AuthUser>('/auth/me', payload);
  return data;
}
