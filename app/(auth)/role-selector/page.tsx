'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BsFillCameraReelsFill } from 'react-icons/bs';
import { RiScissorsFill } from 'react-icons/ri';

export default function RoleSelectorPage() {
  const [isSelectedRole, setIsSelectedRole] = useState<
    'creator' | 'clipper' | null
  >(null);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Lu Pengen Jadi Apa?
        </h1>
        <p className="mt-2 text-base md:text-lg font-medium text-muted-foreground">
          Mau ngasih bahan video atau nyulap video jadi emas?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div
          onClick={() => setIsSelectedRole('creator')}
          className={`p-6 md:p-8 border-4 border-black neo-shadow transition-all duration-150 cursor-pointer rotate-left ${
            isSelectedRole === 'creator'
              ? 'bg-primary text-primary-foreground ring-4 ring-black scale-[1.02]'
              : 'bg-card text-card-foreground hover:bg-primary/20'
          }`}
        >
          <div className="space-y-4">
            <BsFillCameraReelsFill className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                Gua Creator
              </h2>
              <p className="mt-2 text-sm md:text-base font-medium leading-relaxed">
                Gua yang bikin videonya. Butuh orang buat motong-motong biar
                viral.
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setIsSelectedRole('clipper')}
          className={`p-6 md:p-8 border-4 border-black neo-shadow transition-all duration-150 cursor-pointer rotate-right ${
            isSelectedRole === 'clipper'
              ? 'bg-secondary text-secondary-foreground ring-4 ring-black scale-[1.02]'
              : 'bg-card text-card-foreground hover:bg-secondary/20'
          }`}
        >
          <div className="space-y-4">
            <RiScissorsFill className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                Gua Clipper
              </h2>
              <p className="mt-2 text-sm md:text-base font-medium leading-relaxed">
                Gua yang bakal motong video lu biar jadi konten mantap.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10">
        <Button
          disabled={!isSelectedRole}
          type="button"
          className="w-full h-14 bg-tertiary text-tertiary-foreground font-black text-lg md:text-xl uppercase border-4 border-black rounded-none neo-shadow neo-press transition-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjutkan Bro!
        </Button>
      </footer>
    </main>
  );
}
