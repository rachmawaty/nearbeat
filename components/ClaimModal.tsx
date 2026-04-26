"use client";

import { useEffect, useState } from "react";
import { Offer } from "@/lib/types";

const COUNTDOWN_SECONDS = 120;

interface Props {
  offer: Offer | null;
  onClose: () => void;
}

export function ClaimModal({ offer, onClose }: Props) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  // Reset and start countdown whenever a new offer is claimed
  useEffect(() => {
    if (!offer) return;
    setSeconds(COUNTDOWN_SECONDS);

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [offer]);

  if (!offer) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = seconds / COUNTDOWN_SECONDS;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

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
        <p className="text-sm mb-4" style={{ color: "var(--nb-text)" }}>
          {offer.offer}
        </p>

        {/* Countdown ring */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative flex items-center justify-center mb-1">
            <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
              {/* Track */}
              <circle
                cx="36" cy="36" r={radius}
                fill="none"
                stroke="var(--nb-border)"
                strokeWidth="4"
              />
              {/* Progress */}
              <circle
                cx="36" cy="36" r={radius}
                fill="none"
                stroke={seconds <= 30 ? "#EF4444" : "var(--nb-green)"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
              />
            </svg>
            <span
              className="absolute text-base font-bold tabular-nums"
              style={{ color: seconds <= 30 ? "#EF4444" : "var(--nb-text)" }}
            >
              {mins}:{secs}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--nb-muted)" }}>
            Show this at checkout before it expires
          </p>
        </div>

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
