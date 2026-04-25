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
}

export function PersonaSwitcher({ active, onChange }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 px-4 pb-6 pt-3"
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
              <span
                className="text-sm font-bold"
                style={{ color: isActive ? "#fff" : "var(--nb-text)" }}
              >
                {label}
              </span>
              <span
                className="text-[10px] mt-0.5 leading-tight text-center"
                style={{ color: isActive ? "rgba(255,255,255,0.75)" : "var(--nb-muted)" }}
              >
                {sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
