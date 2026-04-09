"use client";

import { useEffect } from "react";

interface GoogleAdSenseProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
  format?: "auto" | "fluid";
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAdSense({ adSlot, className, style, format = "auto" }: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ads might fail to load in dev or before approval, which is expected
      console.debug("AdSense push failed:", err);
    }
  }, [adSlot]);

  return (
    <div className={className} key={adSlot}>
      <ins
        className="adsbygoogle"
        style={style || { display: "block", minWidth: "250px", minHeight: "100px" }}
        data-ad-client="ca-pub-7288756726708711"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
