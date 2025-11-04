import { useEffect, useState } from "react";

export function useAlphaTab() {
  const [alphaTab, setAlphaTab] = useState<any>(null);
  useEffect(() => {
    const _alphaTab = (window as any).alphaTab;
    if (_alphaTab) {
      setAlphaTab(_alphaTab);
      return;
    }
    // Fallback: wait once for script tag to load (if layout loads it later)
    const onLoad = () => setAlphaTab((window as any).alphaTab);
    window.addEventListener("alphatab-ready", onLoad as any, { once: true });
    // If you want to fire this event yourself, see note below.
    return () => window.removeEventListener("alphatab-ready", onLoad as any);
  }, []);
  return alphaTab;
}