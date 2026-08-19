import apiClient from "./api/client";

export interface TopUpResponse {
  id: string;
  balance: number;
}

export async function topUp(amount: number) {
  const { data } = await apiClient.patch<TopUpResponse>('/users/me/topup', { amount });
  return data;
}