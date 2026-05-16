"use client";

import { useState } from "react";

export interface ContextOverrides {
  temporal?: { time_of_day_label?: string; current_time?: string };
  environment?: { weather?: string; weather_code?: string };
  location?: { neighborhood?: string; current_area?: string };
}

interface Props {
  overrides: ContextOverrides;
  onApply: (overrides: ContextOverrides) => void;
  onClose: () => void;
}

const TIME_OPTIONS = [
  { label: "Morning commute", value: "morning_commute", time: "8:05am" },
  { label: "Lunch", value: "lunch", time: "12:10pm" },
  { label: "Afternoon", value: "afternoon", time: "3:00pm" },
  { label: "Evening", value: "evening", time: "6:30pm" },
  { label: "Post gym", value: "post_gym", time: "7:30pm" },
  { label: "Morning", value: "morning", time: "10:30am" },
  { label: "Night", value: "night", time: "9:00pm" },
];

const WEATHER_OPTIONS = [
  { label: "☀️ Sunny", value: "sunny", text: "Sunny" },
  { label: "🌧 Light rain", value: "rain", text: "Light rain" },
  { label: "☁️ Cloudy", value: "cloudy", text: "Cloudy" },
  { label: "❄️ Snow", value: "snow", text: "Snow" },
];

export function ContextEditor({ overrides, onApply, onClose }: Props) {
  const [timeLabel, setTimeLabel] = useState(
    overrides.temporal?.time_of_day_label ?? ""
  );
  const [weatherCode, setWeatherCode] = useState(
    overrides.environment?.weather_code ?? ""
  );

  const handleApply = () => {
    const newOverrides: ContextOverrides = {};
    if (timeLabel) {
      const t = TIME_OPTIONS.find((o) => o.value === timeLabel);
      newOverrides.temporal = { time_of_day_label: timeLabel, current_time: t?.time };
    }
    if (weatherCode) {
      const w = WEATHER_OPTIONS.find((o) => o.value === weatherCode);
      newOverrides.environment = { weather_code: weatherCode, weather: w?.text };
    }
    onApply(newOverrides);
    onClose();
  };

  const handleReset = () => {
    setTimeLabel("");
    setWeatherCode("");
    onApply({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end lg:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl lg:rounded-2xl p-6 pb-10"
        style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-base" style={{ color: "var(--nb-text)" }}>
            Edit context
          </p>
          <button onClick={onClose} style={{ color: "var(--nb-muted)" }} className="text-xl leading-none">
            ×
          </button>
        </div>

        {/* Time of day */}
        <div className="mb-4">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--nb-muted)" }}>
            Time of day
          </p>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeLabel(opt.value)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: timeLabel === opt.value ? "var(--nb-blue)" : "var(--nb-bg)",
                  color: timeLabel === opt.value ? "#fff" : "var(--nb-muted)",
                  border: `1px solid ${timeLabel === opt.value ? "var(--nb-blue)" : "var(--nb-border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--nb-muted)" }}>
            Weather
          </p>
          <div className="flex gap-2">
            {WEATHER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWeatherCode(opt.value)}
                className="flex-1 py-2 rounded-xl text-xs font-medium"
                style={{
                  backgroundColor: weatherCode === opt.value ? "var(--nb-blue)" : "var(--nb-bg)",
                  color: weatherCode === opt.value ? "#fff" : "var(--nb-muted)",
                  border: `1px solid ${weatherCode === opt.value ? "var(--nb-blue)" : "var(--nb-border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-muted)", border: "1px solid var(--nb-border)" }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--nb-blue)" }}
          >
            Regenerate offers
          </button>
        </div>
      </div>
    </div>
  );
}
