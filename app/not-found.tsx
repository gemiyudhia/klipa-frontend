import Link from 'next/link';
import { Ghost, Home, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-black bg-[#FFDE59] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3deg">
          <Ghost className="h-16 w-16 stroke-[1.5] text-black" />
        </div>

        <h1 className="text-6xl font-black uppercase tracking-tight text-black md:text-7xl">
          404
        </h1>

        <div className="mt-4 inline-block rounded-xl border-4 border-black bg-[#FF66C4] px-6 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <p className="text-lg font-black uppercase text-white md:text-xl">
            Halaman Ini Ngilang, Bre!
          </p>
        </div>

        <p className="mt-6 text-sm font-bold text-gray-600 md:text-base">
          Kayaknya halaman yang lu cari udah dipindahin, dihapus, atau emang
          dari awal nggak pernah ada. Cek lagi link-nya, atau balik ke tempat
          yang aman.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <button className="flex items-center justify-center gap-2 rounded-xl border-4 border-black bg-[#FFDE59] px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#ffe680] active:translate-x-1 active:translate-y-1 active:shadow-none">
              <Home className="h-4 w-4" />
              Balik ke Beranda
            </button>
          </Link>

          <Link href="/explore">
            <button className="flex items-center justify-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-1 active:translate-y-1 active:shadow-none">
              <Compass className="h-4 w-4" />
              Eksplor Campaign
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
