import { useState } from "react";
import { Check, MapPin, Sparkles, Calendar, Chrome } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface Props {
  userName: string;
  token: string | null;
  onDone: (profile: ProfileData) => Promise<void>;
}

export interface ProfileData {
  occupation: string;
  age_bracket: string;
  neighborhood: string;
  city: string;
  time_of_day_label: string;
  spend_categories: string[];
  avg_transaction: string;
  location_granted: boolean;
}

const OCCUPATIONS = [
  { label: "Software / Tech", value: "software" },
  { label: "Design / Creative", value: "design" },
  { label: "Business / Finance", value: "business" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Student", value: "student" },
  { label: "Parent / Caregiver", value: "parent" },
  { label: "Other", value: "other" },
];

const AGE_BRACKETS = [
  { label: "20s", value: "20s" },
  { label: "30s", value: "30s" },
  { label: "40s", value: "40s" },
  { label: "50s+", value: "50s+" },
];

const CITIES = ["Boston", "Cambridge"];

const NEIGHBORHOODS: Record<string, string[]> = {
  Boston: ["South End", "Back Bay", "Beacon Hill", "North End", "Financial District", "Fenway", "Seaport", "Jamaica Plain"],
  Cambridge: ["Kendall Square", "Central Square", "Harvard Square", "Inman Square", "Porter Square", "East Cambridge"],
};

const TIME_OPTIONS = [
  { label: "Morning commute", value: "morning_commute", time: "8:05am" },
  { label: "Midday / Lunch", value: "lunch", time: "12:10pm" },
  { label: "Afternoon", value: "afternoon", time: "3:00pm" },
  { label: "Evening", value: "evening", time: "6:30pm" },
  { label: "Weekend morning", value: "morning", time: "10:30am" },
];

const SPEND_OPTIONS = [
  { label: "☕ Coffee", value: "coffee" },
  { label: "🍱 Dining", value: "business_dining" },
  { label: "💪 Health & Gym", value: "health_supplements" },
  { label: "🛍️ Retail", value: "retail" },
  { label: "🥬 Groceries", value: "organic_groceries" },
  { label: "👶 Baby & Family", value: "baby_products" },
  { label: "🍷 Wine & Spirits", value: "wine_spirits" },
  { label: "💊 Wellness", value: "health_wellness" },
];

const TRANSACTION_OPTIONS = [
  { label: "Budget-conscious", value: "low" },
  { label: "Mid-range", value: "medium" },
  { label: "Premium", value: "high" },
];

const TOTAL_STEPS = 4;

export function Onboarding({ userName, token, onDone }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [occupation, setOccupation] = useState("");
  const [ageBracket, setAgeBracket] = useState("");

  // Step 2
  const [city, setCity] = useState("Boston");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 3
  const [timeLabel, setTimeLabel] = useState("morning_commute");
  const [spendCategories, setSpendCategories] = useState<string[]>([]);
  const [avgTransaction, setAvgTransaction] = useState("medium");

  // Step 4
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const toggleSpend = (val: string) =>
    setSpendCategories((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      () => { setLocationGranted(true); setLocationLoading(false); },
      () => { setLocationError("Location access denied — you can enable it later."); setLocationLoading(false); }
    );
  };

  const handleConnectGoogle = () => {
    if (!token) return;
    window.location.href = `/api/auth/google/connect?token=${token}`;
  };

  const handleFinish = async () => {
    setSaving(true);
    await onDone({
      occupation, age_bracket: ageBracket, neighborhood, city,
      time_of_day_label: timeLabel, spend_categories: spendCategories,
      avg_transaction: avgTransaction, location_granted: locationGranted,
    });
  };

  const firstName = userName.split(" ")[0];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Hey, {firstName}!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Let's set up your city pulse</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i < step ? "hsl(var(--primary))" : "hsl(var(--border))" }} />
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md shadow-[var(--shadow-card)]">

          {/* ── Step 1: Who are you? ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-base">Who are you?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Helps us match offers to your lifestyle</p>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Occupation</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {OCCUPATIONS.map((o) => (
                    <button key={o.value} onClick={() => setOccupation(o.value)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                        occupation === o.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Age bracket</label>
                <div className="mt-2 flex gap-2">
                  {AGE_BRACKETS.map((a) => (
                    <button key={a.value} onClick={() => setAgeBracket(a.value)}
                      className={cn("flex-1 py-2 rounded-xl text-sm font-medium border transition-colors",
                        ageBracket === a.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!occupation || !ageBracket}
                className="w-full py-3 rounded-full text-sm font-bold text-white disabled:opacity-40 transition-opacity"
                style={{ background: "var(--gradient-brand)" }}>
                Next →
              </button>
            </div>
          )}

          {/* ── Step 2: Where's your world? ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-base">Where's your world?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">We'll find offers close to you</p>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">City</label>
                <div className="mt-2 flex gap-2">
                  {CITIES.map((c) => (
                    <button key={c} onClick={() => { setCity(c); setNeighborhood(""); }}
                      className={cn("flex-1 py-2 rounded-xl text-sm font-medium border transition-colors",
                        city === c
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Neighborhood</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {NEIGHBORHOODS[city].map((n) => (
                    <button key={n} onClick={() => setNeighborhood(n)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                        neighborhood === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!neighborhood}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white disabled:opacity-40 transition-opacity"
                  style={{ background: "var(--gradient-brand)" }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Your vibe ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-base">Your vibe</h2>
                <p className="text-xs text-muted-foreground mt-0.5">When are you usually out and about?</p>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Primary time of day</label>
                <div className="mt-2 flex flex-col gap-1.5">
                  {TIME_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setTimeLabel(opt.value)}
                      className={cn("flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors",
                        timeLabel === opt.value
                          ? "bg-primary/10 text-primary border-primary"
                          : "border-border/60 text-foreground hover:border-primary/40"
                      )}>
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Spend categories</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPEND_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => toggleSpend(opt.value)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                        spendCategories.includes(opt.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Typical spend level</label>
                <div className="mt-2 flex gap-2">
                  {TRANSACTION_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setAvgTransaction(opt.value)}
                      className={cn("flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors",
                        avgTransaction === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--gradient-brand)" }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Connect your signals ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-base">Connect your signals</h2>
                <p className="text-xs text-muted-foreground mt-0.5">The more you share, the smarter your offers</p>
              </div>

              {/* Location */}
              <div className={cn("rounded-xl border p-4 transition-colors",
                locationGranted ? "border-green-500/40 bg-green-500/5" : "border-border/60 bg-background/40")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                      locationGranted ? "bg-green-500/15" : "bg-primary/10")}>
                      <MapPin className={cn("h-4 w-4", locationGranted ? "text-green-500" : "text-primary")} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Location</p>
                      <p className="text-[11px] text-muted-foreground">Unlocks weather + nearby offers</p>
                    </div>
                  </div>
                  {locationGranted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 shrink-0">
                      <Check className="h-3.5 w-3.5" /> Granted
                    </span>
                  ) : (
                    <button onClick={requestLocation} disabled={locationLoading}
                      className="text-xs font-semibold text-primary hover:underline shrink-0 disabled:opacity-60">
                      {locationLoading ? "Requesting…" : "Allow"}
                    </button>
                  )}
                </div>
                {locationError && <p className="mt-2 text-[11px] text-destructive">{locationError}</p>}
              </div>

              {/* Google Calendar + Gmail */}
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
                      <Chrome className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Google</p>
                      <p className="text-[11px] text-muted-foreground">Calendar events + booking emails</p>
                    </div>
                  </div>
                  <button onClick={handleConnectGoogle}
                    className="text-xs font-semibold text-primary hover:underline shrink-0">
                    Connect
                  </button>
                </div>
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Calendar</span>
                  <span className="flex items-center gap-1">✉ Gmail</span>
                  <span className="ml-auto">Read-only</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                Connect only what you want — you can change this anytime.
              </p>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
                  ← Back
                </button>
                <button onClick={handleFinish} disabled={saving}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "var(--gradient-brand)" }}>
                  {saving ? "Saving…" : "Open my feed →"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
      </div>
    </div>
  );
}
