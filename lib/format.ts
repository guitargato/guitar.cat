// Utility: mm:ss
export function formatTime(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return "0:00";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString();
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}