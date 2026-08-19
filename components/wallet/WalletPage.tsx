'use client';

import { useState } from 'react';
import { WalletCards } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/campaign-utils';
import TopUpCard from './TopUpCard';
import BankInfoCard from './BankInfoCard';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import WithdrawalCard from './WithdrawalCard';
import WithdrawalHistory from './WithdrawalHistory';

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-44 px-4 md:px-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="relative rounded-2xl border-4 border-black bg-[#FFDE59] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
            <div className="absolute -right-3 -top-5 rotate-12 rounded-xl border-4 border-black bg-white p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 md:-right-4 md:-top-6">
              <WalletCards className="h-6 w-6 stroke-[2.5] text-black md:h-8 md:w-8" />
            </div>

            <p className="text-xs font-black uppercase tracking-wider text-black/70">
              Saldo Kamu
            </p>
            <h1 className="text-4xl font-black text-black md:text-5xl">
              {formatCurrency(user?.balance ?? 0)}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TopUpCard onSuccess={() => setRefreshKey((k) => k + 1)} />
            <BankInfoCard />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <WithdrawalCard onSuccess={() => setRefreshKey((k) => k + 1)} />
            <WithdrawalHistory refreshKey={refreshKey} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
