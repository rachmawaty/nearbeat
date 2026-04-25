"use client";

import { Offer } from "@/lib/types";
import { OfferCard } from "./OfferCard";

interface Props {
  offers: Offer[] | null;
  loading: boolean;
  onClaim: (offer: Offer) => void;
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-4 mx-4 animate-pulse"
      style={{
        backgroundColor: "var(--nb-surface)",
        border: "1px solid var(--nb-border)",
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--nb-border)" }} />
        <div className="h-4 w-16 rounded-full" style={{ backgroundColor: "var(--nb-border)" }} />
      </div>
      <div className="h-3 w-40 rounded mb-2" style={{ backgroundColor: "var(--nb-border)" }} />
      <div className="h-3 w-full rounded mb-1" style={{ backgroundColor: "var(--nb-border)" }} />
      <div className="h-3 w-3/4 rounded mb-4" style={{ backgroundColor: "var(--nb-border)" }} />
      <div className="h-9 w-full rounded-full" style={{ backgroundColor: "var(--nb-border)" }} />
    </div>
  );
}

export function OfferFeed({ offers, loading, onClaim }: Props) {
  if (loading || !offers) {
    return (
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {offers.map((offer) => (
        <OfferCard key={offer.merchant_id} offer={offer} onClaim={onClaim} />
      ))}
    </div>
  );
}
