'use client';

import { Button } from '../ui/button';
import {
  Menu,
  UserCircle,
  X,
  LogIn,
  UserPlus,
  LogOut,
  Wallet,
  LayoutDashboard,
  Megaphone,
  Film,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type Role } from '@/store/authStore';
import { toast } from 'sonner';

const navLinks = [
  { label: 'Eksplor Bounty', href: '/explore' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Harga & Komisi', href: '#harga-komisi' },
];

interface ProfileMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function getProfileMenuItems(role: Role | undefined): ProfileMenuItem[] {
  if (role === 'ADMIN') {
    return [
      { label: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard },
      { label: 'Profil Saya', href: '/profile', icon: UserCircle },
    ];
  }

  if (role === 'CREATOR') {
    return [
      { label: 'Campaign Saya', href: '/campaigns', icon: Megaphone },
      { label: 'Wallet', href: '/wallet', icon: Wallet },
      { label: 'Profil Saya', href: '/profile', icon: UserCircle },
    ];
  }

  return [
    { label: 'Klip Gua', href: '/my-clips', icon: Film },
    { label: 'Dispute Gua', href: '/disputes', icon: Scale },
    { label: 'Dompet', href: '/wallet', icon: Wallet },
    { label: 'Profil', href: '/profile', icon: UserCircle },
  ];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
          setIsMenuOpen(false);
          setIsProfileOpen(false);
        } else {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleHamburger = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (!isProfileOpen) setIsMenuOpen(false);
  };

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      logout();
      setIsProfileOpen(false);
      toast.success('Berhasil keluar');
      router.push('/');
    }
  }

  const isLoggedIn = isHydrated && !!user;
  const profileMenuItems = getProfileMenuItems(user?.role);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b-8 border-black py-3 md:py-5 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="relative flex h-14 items-center justify-between px-3 md:h-16 md:px-24">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border-2 border-black"
            onClick={toggleHamburger}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <Image
            src="/brand/klipa-logo.svg"
            alt="Klipa Logo"
            width={140}
            height={140}
            loading="eager"
            className="rotate-right"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Button
                variant="link"
                className="text-black text-lg cursor-pointer"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Desktop: kanan navbar */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button className="neo-button px-10 py-5 font-extrabold text-xl">
                  Masuk
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="px-10 py-5 font-extrabold text-xl text-primary-foreground uppercase shadow-[4px_4px_0_black] transition-none hover:shadow-[6px_6px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Daftar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={toggleProfile}
                className="flex items-center gap-3 border-4 border-black bg-white px-3 py-2 shadow-[4px_4px_0_black] transition-none hover:shadow-[6px_6px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <UserCircle className="w-8 h-8 text-black shrink-0" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-extrabold text-sm uppercase text-black">
                    {user!.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <Wallet className="w-3 h-3" />
                    {formatCurrency(user!.balance ?? 0)}
                  </span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 border-4 border-black bg-white shadow-[6px_6px_0_black] z-50">
                  <div className="flex flex-col gap-1 p-2">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-bold uppercase text-sm"
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}

                    <div className="my-1 border-t-2 border-black/10" />

                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start font-bold uppercase text-sm text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: ikon profil kanan atas */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            className="h-20 w-20 p-0 rounded-full"
            onClick={toggleProfile}
          >
            <UserCircle className="w-8! h-8! text-black" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 left-0 z-50 border-b-4 border-t-4 border-black bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Button
                  variant="link"
                  className="text-black text-lg cursor-pointer w-full text-left justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="absolute right-0 left-0 z-50 border-b-4 border-t-4 border-black bg-white px-4 py-4 md:hidden">
          {!isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase text-gray-500 px-2">
                Akun Gua
              </p>

              <Link href="/sign-in" onClick={() => setIsProfileOpen(false)}>
                <Button className="neo-button px-5 py-3 w-full font-extrabold text-lg flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Masuk
                </Button>
              </Link>

              <Link href="/sign-up" onClick={() => setIsProfileOpen(false)}>
                <Button
                  variant="outline"
                  className="px-5 py-3 font-extrabold text-lg w-full text-primary-foreground uppercase shadow-[4px_4px_0_black] transition-none hover:shadow-[6px_6px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Daftar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 border-4 border-black bg-primary/10 px-3 py-3">
                <UserCircle className="w-10 h-10 text-black shrink-0" />
                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-base uppercase text-black">
                    {user!.name}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                    <Wallet className="w-4 h-4" />
                    {formatCurrency(user!.balance ?? 0)}
                  </span>
                </div>
              </div>

              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="px-5 py-3 font-extrabold text-lg w-full uppercase flex items-center justify-center gap-2"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              <Button
                onClick={handleLogout}
                className="px-5 py-3 font-extrabold text-lg w-full uppercase flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
