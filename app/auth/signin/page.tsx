"use client";

import { useRouter } from "next/navigation";

const PERSONAS = [
  {
    key: "maya",
    name: "Maya",
    emoji: "🏙️",
    role: "UX Designer",
    neighborhood: "South End",
    vibe: "Morning commuter, coffee & wellness",
    color: "#3b82f6",
  },
  {
    key: "carlos",
    name: "Carlos",
    emoji: "💼",
    role: "Sales Director",
    neighborhood: "Financial District",
    vibe: "Client lunches, premium dining",
    color: "#8b5cf6",
  },
  {
    key: "priya",
    name: "Priya",
    emoji: "🌿",
    role: "Wellness Coach",
    neighborhood: "Jamaica Plain",
    vibe: "Weekend explorer, organic & fitness",
    color: "#10b981",
  },
];

export default function SignIn() {
  const router = useRouter();

  const handleSelect = (key: string) => {
    localStorage.setItem("nb_persona", key);
    router.push("/connect");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ backgroundColor: "var(--nb-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <p className="text-sm mt-1" style={{ color: "var(--nb-muted)" }}>your city pulse</p>
        </div>

        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--nb-muted)" }}>Demo prototype</p>
          <h1 className="text-lg font-bold mb-1" style={{ color: "var(--nb-text)" }}>Sign in as a persona</h1>
          <p className="text-xs" style={{ color: "var(--nb-muted)" }}>
            Each persona represents a real Boston city-dweller with different habits, routes, and spending patterns.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {PERSONAS.map((p) => (
            <button
              key={p.key}
              onClick={() => handleSelect(p.key)}
              className="w-full rounded-2xl p-4 text-left transition-all active:scale-95"
              style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${p.color}20` }}
                >
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>{p.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      {p.role}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--nb-muted)" }}>{p.neighborhood} · {p.vibe}</p>
                </div>
                <span style={{ color: "var(--nb-muted)" }}>→</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--nb-muted)" }}>
          No account needed · Prototype data only
        </p>
      </div>
    </div>
  );
}
