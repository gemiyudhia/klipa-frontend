interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = 'ATAU' }: AuthDividerProps) {
  return (
    <div className="relative flex items-center justify-center my-5">
      <div className="border-t-4 border-black w-full"></div>
      <span className="bg-[#f9f9f9] px-4 text-xs font-extrabold text-black uppercase tracking-wide z-10 md:text-2xl">
        {label}
      </span>
      <div className="border-t-[3px] border-black w-full"></div>
    </div>
  );
}
