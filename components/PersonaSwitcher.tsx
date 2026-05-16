"use client";

import { PersonaKey } from "@/lib/types";

const PERSONAS: { key: PersonaKey; label: string; sub: string }[] = [
  { key: "maya", label: "Maya", sub: "Morning commute" },
  { key: "carlos", label: "Carlos", sub: "Client lunch" },
  { key: "priya", label: "Priya", sub: "Weekend errands" },
];

interface Props {
  active: PersonaKey;
  onChange: (key: PersonaKey) => void;
  variant?: "bottom" | "sidebar";
}

export function PersonaSwitcher({ active, onChange, variant = "bottom" }: Props) {
  if (variant === "sidebar") {
    return (
      <div className="flex flex-col gap-2">
        {PERSONAS.map(({ key, label, sub }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: isActive ? "var(--nb-blue)" : "var(--nb-surface)",
                border: `1px solid ${isActive ? "var(--nb-blue)" : "var(--nb-border)"}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--nb-muted)" }}
              >
                {label[0]}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: isActive ? "#fff" : "var(--nb-text)" }}>
                  {label}
                </p>
                <p className="text-[11px]" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--nb-muted)" }}>
                  {sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 px-4 pb-6 pt-3 lg:hidden"
      style={{
        backgroundColor: "var(--nb-bg)",
        borderTop: "1px solid var(--nb-border)",
      }}
    >
      <div className="flex gap-2 max-w-md mx-auto">
        {PERSONAS.map(({ key, label, sub }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all"
              style={{
                backgroundColor: isActive ? "var(--nb-blue)" : "var(--nb-surface)",
                border: `1px solid ${isActive ? "var(--nb-blue)" : "var(--nb-border)"}`,
              }}
            >
              <span className="text-sm font-bold" style={{ color: isActive ? "#fff" : "var(--nb-text)" }}>
                {label}
              </span>
              <span className="text-[10px] mt-0.5 leading-tight text-center" style={{ color: isActive ? "rgba(255,255,255,0.75)" : "var(--nb-muted)" }}>
                {sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
