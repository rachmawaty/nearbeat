"use client";

import { Offer } from "@/lib/types";
import { SignalBadge } from "./SignalBadge";

interface Props {
  offer: Offer;
  onClaim: (offer: Offer) => void;
}

export function OfferCard({ offer, onClaim }: Props) {
  return (
    <div
      className="rounded-2xl p-4 mx-4"
      style={{
        backgroundColor: "var(--nb-surface)",
        border: "1px solid var(--nb-border)",
      }}
    >
      {/* Header: merchant + badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p
          className="font-bold text-base leading-tight"
          style={{ color: "var(--nb-text)" }}
        >
          {offer.merchant_name}
        </p>
        <SignalBadge signal={offer.signal_used} />
      </div>

      {/* Offer value */}
      <p
        className="text-sm font-semibold mb-2"
        style={{ color: "var(--nb-green)" }}
      >
        {offer.offer}
      </p>

      {/* AI reason */}
      <p className="text-xs mb-4" style={{ color: "var(--nb-muted)" }}>
        {offer.reason}
      </p>

      {/* Claim button */}
      <button
        onClick={() => onClaim(offer)}
        className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
        style={{ backgroundColor: "var(--nb-blue)" }}
      >
        Claim offer
      </button>
    </div>
  );
}
