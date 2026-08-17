'use client';

interface SafeZoneOverlayProps {
  visible: boolean;
}

export default function SafeZoneOverlay({ visible }: SafeZoneOverlayProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute top-0 left-0 right-0 h-[8%] border-b-2 border-dashed border-[#FFE600] bg-[#FFE600]/10" />

      <div className="absolute bottom-0 left-0 right-[18%] h-[22%] border-t-2 border-dashed border-[#FFE600] bg-[#FFE600]/10" />

      <div className="absolute right-0 top-[8%] bottom-0 w-[18%] border-l-2 border-dashed border-[#FF3EA5] bg-[#FF3EA5]/10" />

      <div className="absolute top-2 left-2 bg-black/80 text-[#FFE600] text-[10px] font-black uppercase px-2 py-1 rounded border border-[#FFE600]">
        Safe Zone Guide
      </div>
    </div>
  );
}
