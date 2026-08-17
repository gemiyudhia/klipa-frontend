'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import SafeZoneOverlay from './SafeZoneOverlay';
import type { Clip } from '@/lib/api/clip';

interface VerticalVideoModalProps {
  clip: Clip;
  onClose: () => void;
}

function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(url);
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function VerticalVideoModal({ clip, onClose }: VerticalVideoModalProps) {
  const [showSafeZone, setShowSafeZone] = useState(true);

  const youtubeEmbed = getYoutubeEmbedUrl(clip.videoUrl);
  const isDirectVideo = isDirectVideoFile(clip.videoUrl);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black p-4">
          <h2 className="truncate text-lg font-black uppercase text-black">{clip.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100"
          >
            <X className="h-4 w-4 stroke-3" />
          </button>
        </div>

        <div className="relative mx-auto my-4 aspect-9/16 w-full max-w-75 overflow-hidden rounded-xl border-4 border-black bg-black">
          {isDirectVideo ? (
            <video
              src={clip.videoUrl}
              controls
              className="h-full w-full object-contain"
            />
          ) : youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm font-bold text-white">
                Video ini tidak bisa di-embed langsung (kemungkinan link TikTok/Reels).
              </p>
              <a
                href={clip.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-4 py-2 text-xs font-black uppercase text-white hover:bg-white/20"
              >
                Buka Link Video <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <SafeZoneOverlay visible={showSafeZone} />
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => setShowSafeZone((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-3 border-black bg-[#F4F4F5] py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {showSafeZone ? (
              <>
                <EyeOff className="h-4 w-4" /> Sembunyikan Safe Zone
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Tampilkan Safe Zone
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}