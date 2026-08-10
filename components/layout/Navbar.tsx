import { Button } from '../ui/button';
import { Menu, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white border-b-8 py-3 md:py-5 ">
      <div className="relative flex h-14 items-center justify-between px-3 md:h-16 md:px-24">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-9 border-2 border-black"
          >
            <Menu className="w-9 h-5" />
          </Button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <Image
            src="/brand/klipa-logo.svg"
            alt=""
            width={140}
            height={140}
            loading="eager"
            className="rotate-right"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="">
            <Button
              variant="link"
              className="text-black text-lg cursor-pointer"
            >
              Eksplor Bounty
            </Button>
          </Link>
          <Link href="">
            <Button
              variant="link"
              className="text-black text-lg cursor-pointer"
            >
              Cara Kerja
            </Button>
          </Link>
          <Link href="">
            <Button
              variant="link"
              className="text-black text-lg cursor-pointer"
            >
              Harga & Komisi
            </Button>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex space-x-2">
          <Link href="/sign-in">
            <Button className="neo-button px-10 py-5 font-extrabold text-xl">
              Masuk
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button
              variant="outline"
              className=" px-10 py-5 font-extrabold text-xl text-primary-foreground uppercase  shadow-[4px_4px_0_black] transition-none hover:shadow-[6px_6px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Daftar
            </Button>
          </Link>
        </div>

        <div className="flex items-center md:hidden">
          <Button variant="ghost" className="w-20 h-20 p-0">
            <UserCircle className="w-9! h-9!" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
