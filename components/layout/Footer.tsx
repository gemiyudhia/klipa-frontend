import Link from 'next/link';

const navLinks = [
  { label: 'Ekplor Bounty', href: '/explore' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Harga & Komisi', href: '#harga-komisi' },
];
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h2 className="mb-3 text-3xl font-black text-[#FFE600] uppercase tracking-wide">
              KLIPA
            </h2>
            <p className="text-sm font-medium leading-relaxed text-gray-300">
              Platform marketing paling asik buat nyari duit dari klip video lu.
              No ribet, gaspol!
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 md:gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xs font-black tracking-wider text-white transition-colors hover:text-[#FFE600] uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <hr className="my-8 border-t border-gray-600" />

        <div className="text-center">
          <p className="text-xs font-bold text-gray-300">
            &copy; {currentYear} Klipa. Jangan diplagiat bos.
          </p>
        </div>
      </div>
    </footer>
  );
}
