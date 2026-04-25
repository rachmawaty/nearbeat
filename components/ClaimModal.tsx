"use client";

import { Offer } from "@/lib/types";

interface Props {
  offer: Offer | null;
  onClose: () => void;
}

export function ClaimModal({ offer, onClose }: Props) {
  if (!offer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center"
        style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Checkmark */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(16,185,129,0.15)" }}
        >
          <span className="text-3xl">✓</span>
        </div>

        <p className="font-bold text-xl mb-1" style={{ color: "var(--nb-text)" }}>
          Offer claimed!
        </p>
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--nb-green)" }}>
          {offer.merchant_name}
        </p>
        <p className="text-sm mb-1" style={{ color: "var(--nb-text)" }}>
          {offer.offer}
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--nb-muted)" }}>
          Show this at checkout · Expires in 2 hours
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--nb-blue)" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
