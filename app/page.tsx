"use client";

import { useEffect, useRef, useState } from "react";
import { ContextBar } from "@/components/ContextBar";
import { OfferFeed } from "@/components/OfferFeed";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { ClaimModal } from "@/components/ClaimModal";
import { Offer, OfferResponse, PersonaKey } from "@/lib/types";

async function fetchOffers(personaKey: PersonaKey): Promise<OfferResponse> {
  const res = await fetch("/api/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personaKey }),
  });
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export default function Home() {
  const [activePersona, setActivePersona] = useState<PersonaKey>("maya");
  const [cache, setCache] = useState<Partial<Record<PersonaKey, Offer[]>>>({});
  const [loading, setLoading] = useState(true);
  const [claimedOffer, setClaimedOffer] = useState<Offer | null>(null);
  const loadingSet = useRef<Set<PersonaKey>>(new Set());

  const loadPersona = async (key: PersonaKey) => {
    if (cache[key] || loadingSet.current.has(key)) return;
    loadingSet.current.add(key);
    try {
      const data = await fetchOffers(key);
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
    if (!cache[key]) {
      setLoading(true);
      loadPersona(key).then(() => setLoading(false));
    }
  };

  const currentOffers = cache[activePersona] ?? null;
  const isLoading = loading && !currentOffers;

  return (
    <main className="min-h-screen max-w-md mx-auto relative pb-32">
      {/* Wordmark */}
      <div className="px-4 pt-6 pb-2">
        <span className="text-2xl font-bold" style={{ color: "var(--nb-blue)" }}>
          nearbeat
        </span>
        <span className="text-xs ml-2" style={{ color: "var(--nb-muted)" }}>
          your city pulse
        </span>
      </div>

      {/* Context bar */}
      <ContextBar personaKey={activePersona} />

      {/* Offers label */}
      <div className="px-4 mt-5 mb-3">
        <p
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: "var(--nb-muted)" }}
        >
          Offers for you
        </p>
      </div>

      {/* Offer feed */}
      <OfferFeed
        offers={currentOffers}
        loading={isLoading}
        onClaim={setClaimedOffer}
      />

      {/* Persona switcher (fixed bottom) */}
      <PersonaSwitcher active={activePersona} onChange={handlePersonaChange} />

      {/* Claim modal */}
      <ClaimModal offer={claimedOffer} onClose={() => setClaimedOffer(null)} />
    </main>
  );
}
