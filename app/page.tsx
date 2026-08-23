import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    number: '1',
    numberBg: 'bg-[#FFE600]',
    numberText: 'text-black',
    title: 'BUKA CAMPAIGN',
    description:
      'Kreator bikin brief & setor dana escrow. Uang ditahan aman di sistem kami.',
    rotation: 'rotate-[-1.5deg]',
  },
  {
    number: '2',
    numberBg: 'bg-[#D90077]',
    numberText: 'text-white',
    title: 'CLIPPER POTONG',
    description:
      'Clipper pilih campaign, ambil video sumber, edit jadi format vertikal, & submit.',
    rotation: 'rotate-[1deg]',
  },
  {
    number: '3',
    numberBg: 'bg-[#2B52FF]',
    numberText: 'text-white',
    title: 'REVIEW KLIP',
    description:
      'Kreator ngecek hasil. Ada revisi? Minta benerin. Udah oke? Langsung approve.',
    rotation: 'rotate-[-1deg]',
  },
  {
    number: '4',
    numberBg: 'bg-[#1A1A1A]',
    numberText: 'text-white',
    title: 'PENCAIRAN',
    description:
      'Setelah approve, dana escrow langsung cair ke saldo Clipper. Cuan instan!',
    rotation: 'rotate-[1.5deg]',
  },
];

const plans = [
  {
    title: 'UNTUK KREATOR',
    fee: '5%',
    label: 'Platform Fee',
    feeColor: 'text-black',
    btnBg: 'bg-[#FFE600] text-black hover:bg-[#e6ce00]',
    btnText: 'DAFTAR KREATOR',
    rotation: 'rotate-[-1.5deg]',
    features: [
      'Bebas buka campaign',
      'Review klip sepuasnya',
      'Perlindungan Escrow penuh',
      'Refund jika tidak ada klip yang cocok',
    ],
  },
  {
    title: 'UNTUK CLIPPER',
    fee: '10%',
    label: 'Potongan Komisi',
    feeColor: 'text-[#D90077]',
    btnBg: 'bg-[#D90077] text-white hover:bg-[#b50063]',
    btnText: 'DAFTAR CLIPPER',
    rotation: 'rotate-[1.5deg]',
    features: [
      'Bebas pilih campaign',
      'Akses jutaan jam video mentah',
      'Jaminan bayaran (Escrow)',
      'Pencairan dana instan',
    ],
  },
];

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      <section
        id="bounty"
        className="mx-auto max-w-360 px-6 py-10 md:px-10 md:py-20 lg:px-16"
      >
        <div className="flex flex-col items-center justify-between gap-12 md:min-h-175 md:flex-row md:items-center lg:gap-20">
          <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center md:items-start md:text-left">
            <div className="neo-card rotate-left px-4 py-1.5 text-xs font-bold uppercase">
              Aplikasi ini masih DEMO
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
              <Link href="/explore">
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

      <section
        id="cara-kerja"
        className="border-y-2 border-black bg-white py-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4">
          <h2 className="neo-card mb-12 bg-[#2B52FF] px-8 py-3 text-center text-3xl font-black uppercase text-white">
            CARA KERJA
          </h2>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`neo-card flex flex-col justify-start bg-white p-6 transition-transform hover:rotate-0 ${step.rotation}`}
              >
                <div
                  className={`neo-card mb-6 flex h-12 w-12 items-center justify-center text-xl font-black ${step.numberBg} ${step.numberText}`}
                >
                  {step.number}
                </div>

                <h3 className="mb-3 text-2xl font-black uppercase text-black">
                  {step.title}
                </h3>
                <p className="text-lg font-medium leading-relaxed text-gray-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="harga-komisi"
        className="bg-[#2B52FF] py-16 text-white border-b-2 border-black"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4">
          <h2 className="neo-card mb-4 bg-[#FFE600] px-8 py-3 text-center text-3xl font-black uppercase text-black rotate-right">
            HARGA & KOMISI
          </h2>

          <p className="mb-12 text-center text-sm font-medium text-white/90 sm:text-base">
            Transparan. Gak ada biaya tersembunyi. Fair buat Kreator dan
            Clipper.
          </p>

          <div className="flex w-full flex-col justify-center gap-8 md:flex-row md:items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`neo-card flex w-full max-w-md flex-col justify-between bg-white p-8 text-black transition-transform hover:rotate-0 ${plan.rotation}`}
              >
                <div>
                  <div className="text-center">
                    <h3 className="text-lg font-extrabold uppercase tracking-wide text-gray-800">
                      {plan.title}
                    </h3>
                    <div
                      className={`my-2 text-5xl font-black ${plan.feeColor}`}
                    >
                      {plan.fee}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {plan.label}
                    </p>
                  </div>

                  <hr className="my-6 border-t-2 border-black" />

                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-black bg-transparent">
                          <Check className="h-3 w-3 stroke-3 text-black" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`neo-button transform-gpu w-full py-6 font-black uppercase text-sm tracking-wider ${plan.btnBg}`}
                >
                  {plan.btnText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
