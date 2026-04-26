"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ContextBar } from "@/components/ContextBar";
import { OfferFeed } from "@/components/OfferFeed";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { ClaimModal } from "@/components/ClaimModal";
import { ContextEditor, ContextOverrides } from "@/components/ContextEditor";
import { Offer, OfferResponse, PersonaKey } from "@/lib/types";
import { personas } from "@/data/personas";

const CONNECTION_LABELS: Record<string, string> = {
  email: "📧 Gmail",
  bank: "🏦 Bank",
  maps: "📍 Maps",
};

async function fetchOffers(personaKey: PersonaKey, contextOverrides?: ContextOverrides): Promise<OfferResponse> {
  const res = await fetch("/api/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personaKey, contextOverrides }),
  });
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaKey>("maya");
  const [connections, setConnections] = useState<string[]>([]);
  const [cache, setCache] = useState<Partial<Record<PersonaKey, Offer[]>>>({});
  const [loading, setLoading] = useState(true);
  const [claimedOffer, setClaimedOffer] = useState<Offer | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [overrides, setOverrides] = useState<ContextOverrides>({});
  const loadingSet = useRef<Set<PersonaKey>>(new Set());

  useEffect(() => {
    const persona = localStorage.getItem("nb_persona") as PersonaKey | null;
    if (!persona || !(persona in personas)) {
      router.replace("/auth/signin");
      return;
    }
    const conns = JSON.parse(localStorage.getItem("nb_connections") ?? "[]");
    setActivePersona(persona);
    setConnections(conns);
    setReady(true);
  }, [router]);

  const loadPersona = async (key: PersonaKey, forceOverrides?: ContextOverrides) => {
    if (!forceOverrides && (cache[key] || loadingSet.current.has(key))) return;
    loadingSet.current.add(key);
    try {
      const data = await fetchOffers(key, forceOverrides);
      setCache((prev) => ({ ...prev, [key]: data.offers }));
    } finally {
      loadingSet.current.delete(key);
    }
  };

  useEffect(() => {
    if (!ready) return;
    const init = async () => {
      setLoading(true);
      await loadPersona(activePersona);
      setLoading(false);
      const others = (["maya", "carlos", "priya"] as PersonaKey[]).filter((k) => k !== activePersona);
      Promise.all(others.map((k) => loadPersona(k)));
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handlePersonaChange = (key: PersonaKey) => {
    setActivePersona(key);
    setOverrides({});
    if (!cache[key]) {
      setLoading(true);
      loadPersona(key).then(() => setLoading(false));
    }
  };

  const handleRegenerate = async () => {
    setCache((prev) => ({ ...prev, [activePersona]: undefined }));
    loadingSet.current.delete(activePersona);
    setLoading(true);
    await loadPersona(activePersona, Object.keys(overrides).length ? overrides : undefined);
    setLoading(false);
  };

  const handleApplyOverrides = async (newOverrides: ContextOverrides) => {
    setOverrides(newOverrides);
    setCache((prev) => ({ ...prev, [activePersona]: undefined }));
    loadingSet.current.delete(activePersona);
    setLoading(true);
    await loadPersona(activePersona, Object.keys(newOverrides).length ? newOverrides : undefined);
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("nb_persona");
    localStorage.removeItem("nb_connections");
    router.push("/auth/signin");
  };

  if (!ready) return null;

  const currentOffers = cache[activePersona] ?? null;
  const isLoading = loading && !currentOffers;
  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <main className="min-h-screen max-w-md mx-auto relative pb-32">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <span className="text-xs ml-2" style={{ color: "var(--nb-muted)" }}>your city pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: hasOverrides ? "rgba(59,130,246,0.15)" : "var(--nb-surface)",
              color: hasOverrides ? "var(--nb-blue)" : "var(--nb-muted)",
              border: `1px solid ${hasOverrides ? "var(--nb-blue)" : "var(--nb-border)"}`,
            }}
          >
            {hasOverrides ? "✦ Custom" : "⚙ Context"}
          </button>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "var(--nb-surface)", color: "var(--nb-muted)", border: "1px solid var(--nb-border)" }}
          >
            Switch
          </button>
        </div>
      </div>

      {/* Connected data pills */}
      {connections.length > 0 && (
        <div className="px-4 pt-2 flex gap-2 flex-wrap">
          {connections.map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              {CONNECTION_LABELS[c]} ✓
            </span>
          ))}
        </div>
      )}

      {/* Context bar */}
      <ContextBar personaKey={activePersona} overrides={overrides} />

      {/* Offers label + regenerate */}
      <div className="px-4 mt-5 mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--nb-muted)" }}>
          Offers for you
        </p>
        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "var(--nb-surface)",
            color: isLoading ? "var(--nb-border)" : "var(--nb-blue)",
            border: "1px solid var(--nb-border)",
          }}
        >
          <span style={{ display: "inline-block", transform: isLoading ? "rotate(360deg)" : "none", transition: "transform 0.6s" }}>↻</span>
          Refresh
        </button>
      </div>

      <OfferFeed
        offers={currentOffers}
        loading={isLoading}
        context={personas[activePersona]}
        onClaim={setClaimedOffer}
      />

      <PersonaSwitcher active={activePersona} onChange={handlePersonaChange} />

      <ClaimModal offer={claimedOffer} onClose={() => setClaimedOffer(null)} />

      {showEditor && (
        <ContextEditor
          overrides={overrides}
          onApply={handleApplyOverrides}
          onClose={() => setShowEditor(false)}
        />
      )}
    </main>
  );
}
