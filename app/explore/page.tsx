import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BountyCard from '@/components/campaign/BountyCard';
import { getCampaignsServer } from '@/lib/api/server-campaign';
import ExploreSearch from '@/components/campaign/ExploreSearch';

export default async function ExploreBountyPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const result = await getCampaignsServer(page, 12);

  return (
    <main className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <Navbar />

      <section className="flex-1">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="neo-card mb-2 rotate-left bg-[#2B52FF] px-8 py-3 text-2xl font-black uppercase text-white md:text-4xl">
            CARI BOUNTY, TEMUKAN PELUANG!
          </h1>

          <p className="my-3 text-sm font-semibold text-gray-700 md:text-base">
            Pilih campaign favoritmu, potong video klipnya, lalu cairkan
            cuannya!
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <ExploreSearch />
        </div>

        {result.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((campaign, idx) => (
              <BountyCard key={campaign.id} campaign={campaign} index={idx} />
            ))}
          </div>
        ) : (
          <div className="neo-card my-12 bg-white p-8 text-center">
            <p className="text-lg font-black uppercase text-black">
              Bounty tidak ditemukan, Bre!
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
