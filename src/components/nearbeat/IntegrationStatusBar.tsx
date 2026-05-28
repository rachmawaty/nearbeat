import { useState } from "react";
import { INTEGRATIONS } from "@/data/nearbeat";

interface Props {
  onChange?: (enabledKeys: string[]) => void;
}

export function IntegrationStatusBar({ onChange }: Props) {
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(INTEGRATIONS.map((i) => i.key))
  );

  const toggle = (key: string) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onChange?.(Array.from(next));
      return next;
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {INTEGRATIONS.map((it) => {
        const on = enabled.has(it.key);
        return (
          <button
            key={it.key}
            onClick={() => toggle(it.key)}
            title={on ? `${it.label} · ${it.source} · click to disconnect` : `${it.label} · disconnected · click to connect`}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm shrink-0 transition-all duration-200 select-none
              ${on
                ? "border-border/60 bg-card/60 hover:border-border hover:bg-card"
                : "border-border/30 bg-muted/30 opacity-50 hover:opacity-70"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${on ? "pulse-dot" : ""}`}
              style={{
                backgroundColor: on
                  ? `hsl(var(--${it.colorVar}))`
                  : "hsl(var(--muted-foreground))",
              }}
            />
            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${on ? "text-foreground/80" : "text-muted-foreground"}`}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
