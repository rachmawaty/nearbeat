import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, MapPin } from "lucide-react";
import { PERSONAS } from "@/data/nearbeat";

export default function DemoLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold">Nearbeat</h1>
        <p className="text-sm text-muted-foreground mt-1">Your city pulse</p>
      </div>

      {/* Subtitle */}
      <p className="text-center text-base text-foreground mb-8 max-w-sm">
        Choose an account to sign in. Each one comes with their own live context bundle.
      </p>

      {/* Persona cards */}
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <p className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Sign in as
        </p>
        {PERSONAS.map((p, i) => (
          <button
            key={p.key}
            onClick={() => navigate(`/demo/${p.key}`)}
            className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/50 transition-colors ${
              i < PERSONAS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
              {p.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{p.name}</span>
                <span className="text-xs text-muted-foreground truncate">{p.occupation}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{p.subtitle}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{p.area}</span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>

      <p className="mt-8 text-[11px] text-muted-foreground">
        Prototype · MIT AI Hackathon 2026 · Generative City Wallet
      </p>
    </div>
  );
}
