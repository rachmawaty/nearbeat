import { SignalType } from "@/lib/types";

const SIGNAL_CONFIG: Record<
  SignalType,
  { label: string; color: string; bg: string }
> = {
  route: { label: "ROUTE", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  schedule: { label: "SCHEDULE", color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  habit: { label: "HABIT", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  weather: { label: "WEATHER", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  spend_history: { label: "SPEND", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
};

export function SignalBadge({ signal }: { signal: SignalType }) {
  const cfg = SIGNAL_CONFIG[signal];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}
