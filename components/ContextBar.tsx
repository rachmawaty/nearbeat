"use client";

import { personas } from "@/data/personas";
import { PersonaKey } from "@/lib/types";
import { ContextOverrides } from "./ContextEditor";

const weatherIcons: Record<string, string> = {
  rain: "🌧",
  sunny: "☀️",
  cloudy: "☁️",
  snow: "❄️",
};

interface Props {
  personaKey: PersonaKey;
  overrides?: ContextOverrides;
  className?: string;
}

export function ContextBar({ personaKey, overrides = {}, className = "rounded-xl p-4 mx-4 mt-4" }: Props) {
  const ctx = personas[personaKey];
  const { persona, location, route } = ctx;

  const temporal = { ...ctx.temporal, ...overrides.temporal };
  const environment = { ...ctx.environment, ...overrides.environment };

  const nextWaypoint = route.upcoming_waypoints[0];

  return (
    <div
      className={className}
      style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}
    >
      {/* Top row: avatar + name + location */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: "var(--nb-blue)" }}
        >
          {persona.name[0]}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>
            {persona.name}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--nb-muted)" }}>
            {location.neighborhood} · {location.city}
          </p>
        </div>
        {/* Weather pill — reflects overrides instantly */}
        <div
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
          style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-text)" }}
        >
          <span>{weatherIcons[environment.weather_code]}</span>
          <span>{environment.weather}</span>
        </div>
      </div>

      {/* Bottom row: time + next waypoint */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--nb-muted)" }}>🕐</span>
          <span className="text-xs font-medium" style={{ color: "var(--nb-text)" }}>
            {temporal.current_time}
          </span>
        </div>
        {nextWaypoint && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: "var(--nb-muted)" }}>📍</span>
            <span className="text-xs" style={{ color: "var(--nb-muted)" }}>{nextWaypoint.name}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--nb-blue)" }}>
              {nextWaypoint.eta_minutes}m
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
