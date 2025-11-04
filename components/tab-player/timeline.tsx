'use client'

import { useMemo, useState } from "react";
import { formatTime } from '@/lib/format'

export function Timeline({
  percent, durationMs, onSeek, disabled,
}: { percent: number; durationMs: number; onSeek: (v: number[]) => void; disabled?: boolean }) {
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const hoverTime = useMemo(
    () => (hoverPct == null || !durationMs ? null : formatTime((hoverPct / 100) * durationMs)),
    [hoverPct, durationMs]
  );
  const pctFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  };
  return (
    <div
      className="relative w-full select-none"
      onMouseMove={(e) => setHoverPct(pctFromEvent(e))}
      onMouseLeave={() => setHoverPct(null)}
      onClick={(e) => !disabled && onSeek([Math.round(pctFromEvent(e))])}
      aria-label="Timeline"
    >
      <div className={`h-3 rounded-full bg-muted/60 overflow-hidden ${disabled ? "opacity-50" : ""}`}>
        <div className="h-full bg-primary/70" style={{ width: `${percent}%` }} />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary shadow-sm"
        style={{ left: `${percent}%` }}
      />
      {hoverPct != null && !disabled && (
        <div className="pointer-events-none">
          <div className="absolute top-0 bottom-0 w-px bg-primary/30" style={{ left: `${hoverPct}%` }} />
          {hoverTime && (
            <div
              className="absolute -top-7 px-2 py-0.5 rounded-md text-xs bg-popover text-popover-foreground shadow border"
              style={{ left: `${hoverPct}%`, transform: "translateX(-50%)" }}
            >
              {hoverTime}
            </div>
          )}
        </div>
      )}
    </div>
  );
}