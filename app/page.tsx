import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-360 px-6 py-10 md:px-10 md:py-20 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-12 md:min-h-175 md:flex-row md:items-center lg:gap-20">
          <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center md:items-start md:text-left">
            <div className="neo-card rotate-left px-4 py-1.5 text-xs font-bold uppercase">
              Beta Launch
            </div>

            <h1 className="neo-card rotate-left bg-primary px-10 py-10 text-3xl font-extrabold uppercase leading-tight sm:text-4xl lg:px-12 lg:py-11 lg:text-6xl">
              <span className="block">Dari Konten</span>
              <span className="block">Jadi Cuan</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed md:text-xl">
              Platform marketing paling asik buat nyari duit dari klip video lu.
              No ribet, gaspol!
            </p>

            <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-sm md:w-auto">
              <Link href="/">
                <Button className="neo-button w-full bg-secondary px-10 py-7 text-lg font-bold text-white">
                  Gas Cobain Bre!!
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden h-150 w-full max-w-175 items-center justify-center md:flex lg:h-162.5">
            <Image
              src="/images/hero/smartphone-video.png"
              alt="Smartphone Preview"
              width={600}
              height={1080}
              loading="eager"
              priority
              className="relative z-20 w-75 lg:w-87.5"
            />

            <Image
              src="/images/hero/status-duit.png"
              alt="Status Duit"
              width={500}
              height={500}
              loading="eager"
              priority
              className="absolute -left-5 top-4 z-30 w-60 lg:w-70"
            />

            <Image
              src="/images/hero/udah-cair.png"
              alt="Udah Cair"
              width={500}
              height={500}
              loading="eager"
              priority
              className="absolute -left-7.5 bottom-10 z-30 w-57.5 lg:w-67.5"
            />

            <Image
              src="/images/hero/review-video.png"
              alt="Review Video"
              width={600}
              height={600}
              loading="eager"
              priority
              className="absolute -right-2.5 top-24 z-30 w-65 lg:w-77.5"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
