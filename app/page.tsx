"use client";

import { useEffect, useRef, useState } from "react";
import { ContextBar } from "@/components/ContextBar";
import { OfferFeed } from "@/components/OfferFeed";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { ClaimModal } from "@/components/ClaimModal";
import { ContextEditor, ContextOverrides } from "@/components/ContextEditor";
import { Offer, OfferResponse, PersonaKey } from "@/lib/types";
import { personas } from "@/data/personas";

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
  const [activePersona, setActivePersona] = useState<PersonaKey>("maya");
  const [cache, setCache] = useState<Partial<Record<PersonaKey, Offer[]>>>({});
  const [loading, setLoading] = useState(true);
  const [claimedOffer, setClaimedOffer] = useState<Offer | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [overrides, setOverrides] = useState<ContextOverrides>({});
  const loadingSet = useRef<Set<PersonaKey>>(new Set());

  const loadPersona = async (key: PersonaKey, forceOverrides?: ContextOverrides) => {
    // Only skip if already cached and no overrides being applied
    if (!forceOverrides && (cache[key] || loadingSet.current.has(key))) return;
    loadingSet.current.add(key);
    try {
      const data = await fetchOffers(key, forceOverrides);
      setCache((prev) => ({ ...prev, [key]: data.offers }));
    } finally {
      loadingSet.current.delete(key);
    }
  };

  // Pre-fetch maya first (default), then background-load others
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadPersona("maya");
      setLoading(false);
      Promise.all([loadPersona("carlos"), loadPersona("priya")]);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePersonaChange = (key: PersonaKey) => {
    setActivePersona(key);
    setOverrides({});
    if (!cache[key]) {
      setLoading(true);
      loadPersona(key).then(() => setLoading(false));
    }
  };

  // #6 — Regenerate: clear cache for current persona and re-fetch
  const handleRegenerate = async () => {
    setCache((prev) => ({ ...prev, [activePersona]: undefined }));
    loadingSet.current.delete(activePersona);
    setLoading(true);
    await loadPersona(activePersona, Object.keys(overrides).length ? overrides : undefined);
    setLoading(false);
  };

  // #1 — Apply context overrides and regenerate
  const handleApplyOverrides = async (newOverrides: ContextOverrides) => {
    setOverrides(newOverrides);
    setCache((prev) => ({ ...prev, [activePersona]: undefined }));
    loadingSet.current.delete(activePersona);
    setLoading(true);
    await loadPersona(activePersona, Object.keys(newOverrides).length ? newOverrides : undefined);
    setLoading(false);
  };

  const currentOffers = cache[activePersona] ?? null;
  const isLoading = loading && !currentOffers;
  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <main className="min-h-screen max-w-md mx-auto relative pb-32">
      {/* Wordmark */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold" style={{ color: "var(--nb-blue)" }}>
            nearbeat
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--nb-muted)" }}>
            your city pulse
          </span>
        </div>
        {/* #1 — Edit context button */}
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
      </div>

      {/* Context bar */}
      <ContextBar personaKey={activePersona} overrides={overrides} />

      {/* Offers label + regenerate button */}
      <div className="px-4 mt-5 mb-3 flex items-center justify-between">
        <p
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: "var(--nb-muted)" }}
        >
          Offers for you
        </p>
        {/* #6 — Regenerate button */}
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

      {/* Offer feed */}
      <OfferFeed
        offers={currentOffers}
        loading={isLoading}
        context={personas[activePersona]}
        onClaim={setClaimedOffer}
      />

      {/* Persona switcher (fixed bottom) */}
      <PersonaSwitcher active={activePersona} onChange={handlePersonaChange} />

      {/* Claim modal */}
      <ClaimModal offer={claimedOffer} onClose={() => setClaimedOffer(null)} />

      {/* Context editor */}
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
