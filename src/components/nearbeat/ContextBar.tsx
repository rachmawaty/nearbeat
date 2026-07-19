import type { Persona } from "@/data/nearbeat";
import type { WeatherData } from "@/hooks/useWeather";
import { Clock, MapPin, Navigation } from "lucide-react";

interface Props {
  persona: Persona;
  time: string;
  liveWeather?: WeatherData | null;
  liveCity?: string | null;
}

export function ContextBar({ persona, time, liveWeather, liveCity }: Props) {
  const weather = liveWeather ?? persona.weather;
  const area = liveCity ?? persona.area;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-md shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
          style={{ background: "var(--gradient-brand)" }}
        >
          <span>{persona.avatar}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-base font-semibold leading-tight truncate">
              {persona.name}
            </h2>
            <span className="text-xs text-muted-foreground truncate">{persona.occupation}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{persona.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Pill icon={<MapPin className="h-3.5 w-3.5" />} label={area} live={!!liveCity} />
        <Pill icon={<Clock className="h-3.5 w-3.5" />} label={time} />
        <Pill
          icon={<span className="text-sm leading-none">{weather.emoji}</span>}
          label={`${weather.temp}° · ${weather.label}`}
          live={!!liveWeather}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
        <Navigation className="h-4 w-4 text-primary" />
        <span className="text-xs text-foreground/90">
          Next waypoint:{" "}
          <span className="font-semibold">{persona.next_waypoint.name}</span> in{" "}
          <span className="font-semibold">{persona.next_waypoint.eta} min</span>
        </span>
      </div>
    </div>
  );
}

function Pill({ icon, label, live }: { icon: React.ReactNode; label: string; live?: boolean }) {
  return (
    <div className="relative flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5 text-foreground/85">
      {icon}
      <span className="truncate">{label}</span>
      {live && (
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 ring-1 ring-background" />
      )}
    </div>
  );
}