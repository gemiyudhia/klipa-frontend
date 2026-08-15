'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import BountyCard from '@/components/campaign/BountyCard';
import { getPublicCampaigns, type Campaign } from '@/lib/api/campaign';

type Props = {
  initialCampaigns: Campaign[];
  initialTotalPages: number;
};

export default function ExploreBountyClient({
  initialCampaigns,
  initialTotalPages,
}: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(initialTotalPages);

  async function handleLoadMore() {
    if (isLoading || page >= totalPages) return;

    const nextPage = page + 1;

    setIsLoading(true);

    try {
      const result = await getPublicCampaigns(nextPage);

      setCampaigns((prev) => [...prev, ...result.data]);

      setPage(nextPage);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat campaign, coba lagi');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredCampaigns = campaigns.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <div className='flex-1'>
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="neo-card mb-2 rotate-left bg-[#2B52FF] px-8 py-3 text-2xl font-black uppercase text-white md:text-4xl">
              CARI BOUNTY, TEMUKAN PELUANG!
            </h1>

            <p className="my-3 text-sm font-semibold text-gray-700 md:text-base">
              Pilih campaign favoritmu, potong video klipnya, lalu cairkan
              cuannya!
            </p>
          </div>

          <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Ketik judul campaign..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neo-card w-full bg-white py-3 pl-11 pr-4 font-bold text-black placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
              />

              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 stroke-3 text-black" />
            </div>
          </div>

          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign, idx) => (
                <BountyCard key={campaign.id} campaign={campaign} index={idx} />
              ))}
            </div>
          ) : (
            <div className="neo-card my-12 bg-white p-8 text-center">
              <p className="text-lg font-black uppercase text-black">
                Bounty tidak ditemukan, Bre!
              </p>

              <p className="text-sm font-medium text-gray-600">
                Coba cari dengan kata kunci lain.
              </p>
            </div>
          )}

          {page < totalPages && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="neo-button bg-white px-8 py-6 text-base font-black uppercase text-black hover:bg-gray-100"
              >
                {isLoading ? 'Lagi Muat...' : 'LIHAT LEBIH BANYAK'}
              </Button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
