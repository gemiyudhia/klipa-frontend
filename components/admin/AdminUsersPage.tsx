'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Ban, CheckCircle2 } from 'lucide-react';

import {
  getAllUsers,
  suspendUser,
  unsuspendUser,
  type AdminUser,
} from '@/lib/api/admin';
import { formatCurrency } from '@/lib/campaign-utils';
import AdminSidebar from './AdminSidebar';
import SuspendModal from './SuspendModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllUsers({
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(result.data);
    } catch (error) {
      toast.error('Gagal memuat data user');
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  async function handleSuspend(reason: string) {
    if (!suspendTarget) return;
    try {
      await suspendUser(suspendTarget.id, reason);
      toast.success(`${suspendTarget.name} berhasil disuspend`);
      setSuspendTarget(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal suspend user');
    }
  }

  async function handleUnsuspend(user: AdminUser) {
    try {
      await unsuspendUser(user.id);
      toast.success(`${user.name} berhasil di-unsuspend`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal unsuspend user');
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              Kelola User
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-700">
              Suspend/unsuspend akun user.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-3 border-black bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-black focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-3 border-black bg-white px-4 py-2.5 text-sm font-bold text-black"
            >
              <option value="">Semua Role</option>
              <option value="CREATOR">Creator</option>
              <option value="CLIPPER">Clipper</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col items-start justify-between gap-3 rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:flex-row md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-black">{u.name}</p>
                      <span className="rounded-md border-2 border-black bg-[#F4F4F5] px-2 py-0.5 text-[10px] font-black uppercase">
                        {u.role}
                      </span>
                      {u.isSuspended && (
                        <span className="rounded-md border-2 border-black bg-[#FF4848] px-2 py-0.5 text-[10px] font-black uppercase text-white">
                          Disuspend
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-600">{u.email}</p>
                    <p className="text-xs font-bold text-gray-500">
                      Saldo: {formatCurrency(u.balance)}
                    </p>
                  </div>

                  {u.role !== 'ADMIN' && (
                    <div>
                      {u.isSuspended ? (
                        <button
                          onClick={() => handleUnsuspend(u)}
                          className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#7ED957] px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuspendTarget(u)}
                          className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FF4848] px-3 py-2 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Ban className="h-4 w-4" /> Suspend
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {suspendTarget && (
        <SuspendModal
          userName={suspendTarget.name}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleSuspend}
        />
      )}
    </div>
  );
}
