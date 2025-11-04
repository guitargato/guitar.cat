'use client'

import Script from "next/script";

export const AlphaTab = () => (
  <Script
    src="/alphatab/alphaTab.min.js"
    strategy="beforeInteractive"
    onLoad={() => window.dispatchEvent(new Event("alphatab-ready"))}
  />
)