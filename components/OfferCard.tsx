"use client";

import { useState } from "react";
import { ContextBundle, Offer } from "@/lib/types";
import { SignalBadge } from "./SignalBadge";

interface Props {
  offer: Offer;
  context: ContextBundle;
  onClaim: (offer: Offer) => void;
}

function getSignalDetail(offer: Offer, context: ContextBundle): string {
  const { signal_used } = offer;
  const { route, schedule, environment, spend_history } = context;

  switch (signal_used) {
    case "route": {
      const wp = route.upcoming_waypoints.find((w) =>
        w.name.toLowerCase().includes(offer.merchant_name.toLowerCase().split(" ")[0])
      );
      if (wp) return `${offer.merchant_name} is ${wp.eta_minutes} min ahead on your route today.`;
      return `${offer.merchant_name} is on your route today.`;
    }
    case "schedule": {
      const event = schedule.today.find((e) =>
        e.event.toLowerCase().includes("gym") ||
        e.event.toLowerCase().includes("lunch") ||
        e.event.toLowerCase().includes("client")
      ) ?? schedule.today[0];
      return event ? `Your schedule: "${event.event}" at ${event.time}.` : "Matches your schedule today.";
    }
    case "habit": {
      const pattern = schedule.recurring_patterns[0];
      return pattern
        ? `Recurring habit: "${pattern.pattern}" on ${pattern.days.join(", ")}.`
        : "Matches your regular routine.";
    }
    case "weather": {
      return `Current weather: ${environment.weather} — this offer is relevant right now.`;
    }
    case "spend_history": {
      const cat = spend_history.frequent_categories[0];
      return cat
        ? `You frequently spend on ${cat.replace("_", " ")} — this matches your pattern.`
        : "Matches your spending history.";
    }
    default:
      return "This offer was selected based on your context.";
  }
}

export function OfferCard({ offer, context, onClaim }: Props) {
  const [expanded, setExpanded] = useState(false);
  const signalDetail = getSignalDetail(offer, context);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: "var(--nb-surface)",
        border: "1px solid var(--nb-border)",
      }}
    >
      {/* Header: merchant + badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-bold text-base leading-tight" style={{ color: "var(--nb-text)" }}>
          {offer.merchant_name}
        </p>
        {/* Tapping the badge toggles the expanded panel */}
        <button onClick={() => setExpanded((v) => !v)}>
          <SignalBadge signal={offer.signal_used} />
        </button>
      </div>

      {/* Offer value */}
      <p className="text-sm font-semibold mb-2" style={{ color: "var(--nb-green)" }}>
        {offer.offer}
      </p>

      {/* AI reason */}
      <p className="text-xs mb-3" style={{ color: "var(--nb-muted)" }}>
        {offer.reason}
      </p>

      {/* Expanded signal detail panel */}
      {expanded && (
        <div
          className="rounded-xl px-3 py-2.5 mb-3 text-xs"
          style={{
            backgroundColor: "var(--nb-bg)",
            borderLeft: "3px solid var(--nb-blue)",
            color: "var(--nb-muted)",
          }}
        >
          <p className="font-semibold mb-0.5" style={{ color: "var(--nb-text)" }}>
            Why this offer?
          </p>
          <p>{signalDetail}</p>
        </div>
      )}

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
