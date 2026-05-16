import { Sparkles, Zap } from "lucide-react";
import type { AgentStep } from "@/hooks/useAgent";

const TOOL_LABELS: Record<string, { emoji: string; label: string }> = {
  get_merchants_nearby:   { emoji: "📍", label: "Fetching nearby merchants" },
  get_live_weather:       { emoji: "🌤️", label: "Reading live weather" },
  score_signal_relevance: { emoji: "⚡", label: "Scoring signal strength" },
};

interface Props {
  steps: AgentStep[];
  loading: boolean;
  reasoning?: string;
  signals?: string[];
  error?: string | null;
  onRun: () => void;
  hasResult: boolean;
  stale: boolean;
  minutesSince: number;
}

export function AgentThinking({ steps, loading, reasoning, signals, error, onRun, hasResult, stale, minutesSince }: Props) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nearbeat Agent</span>
        </div>
        <button
          onClick={onRun}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all disabled:opacity-50 border border-border"
          style={loading ? {} : { background: "var(--gradient-brand)", color: "white", border: "none" }}
        >
          <Zap className="h-3 w-3" />
          {loading ? "Thinking…" : hasResult ? (stale ? `Refresh (${Math.round(minutesSince)}m)` : "Re-run") : "Generate with AI"}
        </button>
      </div>

      {steps.length > 0 && (
        <div className="mb-3 space-y-1">
          {steps.map((step, i) => {
            const meta = TOOL_LABELS[step.tool] ?? { emoji: "🔧", label: step.tool };
            return (
              <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{meta.emoji}</span>
                <span className="font-medium">{meta.label}</span>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground animate-pulse">
              <span>🤔</span><span>Reasoning over signals…</span>
            </div>
          )}
        </div>
      )}

      {signals && signals.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {signals.map((s) => (
            <span key={s} className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">{s}</span>
          ))}
        </div>
      )}

      {reasoning && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground/70">Agent: </span>{reasoning}
        </p>
      )}

      {error && <p className="text-[11px] text-destructive">⚠ {error}</p>}

      {!hasResult && !loading && !error && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Click <strong>Generate with AI</strong> to run the Nearbeat agent — it will score your signals and generate 3 personalised offers using Claude.
        </p>
      )}
    </div>
  );
}
