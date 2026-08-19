import apiClient from "./api/client";

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  taxAmount: number | null;
  netAmount: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
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

export interface UpdateBankInfoPayload {
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export async function updateBankInfo(payload: UpdateBankInfoPayload) {
  const { data } = await apiClient.patch('/withdrawal/bank-info', payload);
  return data;
}

export async function createWithdrawal(amount: number) {
  const { data } = await apiClient.post<Withdrawal>('/withdrawal', { amount });
  return data;
}

export async function getMyWithdrawals(page = 1, limit = 20) {
  const { data } = await apiClient.get<PaginatedResponse<Withdrawal>>('/withdrawal/mine', {
    params: { page, limit },
  });
  return data;
}