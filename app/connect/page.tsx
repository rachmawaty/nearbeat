"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PERSONA_NAMES: Record<string, string> = {
  maya: "Maya",
  carlos: "Carlos",
  priya: "Priya",
};

const CONNECTIONS = [
  {
    id: "email",
    icon: "📧",
    provider: "Gmail",
    title: "Purchase receipts & bookings",
    description:
      "Nearbeat reads emails from merchants, restaurants, and services to understand your spending patterns and predict relevant offers.",
    dataPoints: ["Order confirmations", "Booking receipts", "Loyalty emails"],
    color: "#ea4335",
  },
  {
    id: "bank",
    icon: "🏦",
    provider: "Bank Account",
    title: "Transaction history",
    description:
      "Connected via Plaid (read-only). Nearbeat analyzes your last 90 days of local merchant transactions to learn your spending habits.",
    dataPoints: ["Local merchant spend", "Category patterns", "Frequency of visits"],
    color: "#16a34a",
  },
  {
    id: "maps",
    icon: "📍",
    provider: "Google Maps",
    title: "Location & route history",
    description:
      "Nearbeat learns your daily routes, frequent stops, and typical commute times so offers appear exactly when and where you need them.",
    dataPoints: ["Daily commute routes", "Frequent stops", "Time-of-day patterns"],
    color: "#2563eb",
  },
];

export default function Connect() {
  const router = useRouter();
  const [personaName, setPersonaName] = useState("");
  const [allowed, setAllowed] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const key = localStorage.getItem("nb_persona") ?? "maya";
    setPersonaName(PERSONA_NAMES[key] ?? "you");
  }, []);

  const decide = (id: string, allow: boolean) => {
    setAllowed((prev) => ({ ...prev, [id]: allow }));
    setDecided((prev) => ({ ...prev, [id]: true }));
  };

  const allDecided = CONNECTIONS.every((c) => decided[c.id]);

  const handleContinue = () => {
    const connections = CONNECTIONS.filter((c) => allowed[c.id]).map((c) => c.id);
    localStorage.setItem("nb_connections", JSON.stringify(connections));
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10" style={{ backgroundColor: "var(--nb-bg)" }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <p className="text-xs mt-1" style={{ color: "var(--nb-muted)" }}>AI city wallet · agent permissions</p>
        </div>

        <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>Nearbeat Agent</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "var(--nb-blue)" }}>
              wants access
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--nb-text)" }}>
            Hi <strong>{personaName}</strong> — to build your city pulse, Nearbeat needs to read your real-world data.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--nb-muted)" }}>
            All data is read-only · processed locally · never sold · you can revoke anytime.
          </p>
        </div>

        {/* Permission cards */}
        <div className="flex flex-col gap-3 mb-5">
          {CONNECTIONS.map((conn) => {
            const isDone = decided[conn.id];
            const isAllowed = allowed[conn.id];

            return (
              <div
                key={conn.id}
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: "var(--nb-surface)",
                  border: `1px solid ${isDone && isAllowed ? conn.color : "var(--nb-border)"}`,
                  opacity: isDone && !isAllowed ? 0.5 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${conn.color}15` }}
                  >
                    {conn.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>{conn.provider}</span>
                      {isDone && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: isAllowed ? `${conn.color}20` : "var(--nb-bg)",
                            color: isAllowed ? conn.color : "var(--nb-muted)",
                          }}
                        >
                          {isAllowed ? "✓ Allowed" : "Skipped"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--nb-text)" }}>{conn.title}</p>
                    <p className="text-xs mb-2" style={{ color: "var(--nb-muted)" }}>{conn.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {conn.dataPoints.map((pt) => (
                        <span key={pt} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-muted)", border: "1px solid var(--nb-border)" }}>
                          {pt}
                        </span>
                      ))}
                    </div>

                    {!isDone && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => decide(conn.id, true)}
                          className="flex-1 py-2 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: conn.color }}
                        >
                          Allow
                        </button>
                        <button
                          onClick={() => decide(conn.id, false)}
                          className="flex-1 py-2 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-muted)", border: "1px solid var(--nb-border)" }}
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!allDecided}
          className="w-full py-3 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: allDecided ? "var(--nb-blue)" : "var(--nb-muted)" }}
        >
          {allDecided ? "Get my city pulse →" : "Review all permissions above"}
        </button>

        <p className="text-center text-xs mt-4" style={{ color: "var(--nb-muted)" }}>
          This is a demo — no real data is accessed
        </p>
      </div>
    </div>
  );
}
