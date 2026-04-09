import { GoogleAdSense } from "./GoogleAdSense";

interface AdsPlaceholderProps {
  adSlot?: string;
  className?: string;
}

export function AdsPlaceholder({ adSlot, className }: AdsPlaceholderProps) {
  if (adSlot) {
    return (
      <div className={className}>
        <GoogleAdSense adSlot={adSlot} />
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-outline-variant/20 flex w-full shrink-0 items-center justify-center rounded-2xl border p-4 min-h-[100px]">
      <span className="font-label text-on-surface-variant text-xs tracking-wide uppercase opacity-50">
        Community Support (AdSense)
      </span>
    </div>
  );
}
