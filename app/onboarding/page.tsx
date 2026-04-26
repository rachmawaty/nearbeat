"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const NEIGHBORHOODS = [
  "South End", "Back Bay", "Newbury Street", "Beacon Hill", "North End",
  "Kendall Square", "Central Square", "Harvard Square", "Jamaica Plain",
  "Financial District", "Fenway", "Seaport",
];

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

export default function Onboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1 — neighborhood
  const [neighborhood, setNeighborhood] = useState("");
  const [customArea, setCustomArea] = useState("");

  // Step 2 — time + spend
  const [timeLabel, setTimeLabel] = useState("morning_commute");
  const [spendCategories, setSpendCategories] = useState<string[]>([]);
  const [avgTransaction, setAvgTransaction] = useState("medium");

  const toggleSpend = (val: string) => {
    setSpendCategories((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    const timeOpt = TIME_OPTIONS.find((t) => t.value === timeLabel);

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        neighborhood,
        currentArea: customArea || `${neighborhood}, Boston`,
        timeOfDayLabel: timeLabel,
        currentTime: timeOpt?.time ?? "8:05am",
        spendCategories,
        avgTransaction,
      }),
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--nb-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <p className="text-sm mt-1" style={{ color: "var(--nb-muted)" }}>
            Hi {session?.user?.name?.split(" ")[0] ?? "there"} — let&apos;s set up your city pulse
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6 px-1">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 h-1 rounded-full"
              style={{ backgroundColor: s <= step ? "var(--nb-blue)" : "var(--nb-border)" }} />
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}>

          {step === 1 && (
            <>
              <h2 className="font-bold text-base mb-1" style={{ color: "var(--nb-text)" }}>Where are you based?</h2>
              <p className="text-xs mb-4" style={{ color: "var(--nb-muted)" }}>We&apos;ll find offers near your neighborhood</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {NEIGHBORHOODS.map((n) => (
                  <button key={n} onClick={() => setNeighborhood(n)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: neighborhood === n ? "var(--nb-blue)" : "var(--nb-bg)",
                      color: neighborhood === n ? "#fff" : "var(--nb-muted)",
                      border: `1px solid ${neighborhood === n ? "var(--nb-blue)" : "var(--nb-border)"}`,
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="text" placeholder="Or type your street / area…"
                value={customArea} onChange={(e) => setCustomArea(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
                style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
              />
              <button onClick={() => setStep(2)} disabled={!neighborhood && !customArea}
                className="w-full py-3 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: (!neighborhood && !customArea) ? "var(--nb-muted)" : "var(--nb-blue)" }}>
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-bold text-base mb-1" style={{ color: "var(--nb-text)" }}>Your typical day</h2>
              <p className="text-xs mb-4" style={{ color: "var(--nb-muted)" }}>When are you usually out and about?</p>

              <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--nb-muted)" }}>
                Primary time of day
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {TIME_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setTimeLabel(opt.value)}
                    className="py-2.5 px-4 rounded-xl text-sm font-medium text-left"
                    style={{
                      backgroundColor: timeLabel === opt.value ? "rgba(59,130,246,0.15)" : "var(--nb-bg)",
                      color: timeLabel === opt.value ? "var(--nb-blue)" : "var(--nb-text)",
                      border: `1px solid ${timeLabel === opt.value ? "var(--nb-blue)" : "var(--nb-border)"}`,
                    }}>
                    {opt.label}
                    <span className="float-right text-xs" style={{ color: "var(--nb-muted)" }}>{opt.time}</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--nb-muted)" }}>
                What do you spend on? (pick all that apply)
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SPEND_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => toggleSpend(opt.value)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: spendCategories.includes(opt.value) ? "var(--nb-blue)" : "var(--nb-bg)",
                      color: spendCategories.includes(opt.value) ? "#fff" : "var(--nb-muted)",
                      border: `1px solid ${spendCategories.includes(opt.value) ? "var(--nb-blue)" : "var(--nb-border)"}`,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--nb-muted)" }}>
                Typical spend level
              </p>
              <div className="flex gap-2 mb-5">
                {TRANSACTION_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setAvgTransaction(opt.value)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium"
                    style={{
                      backgroundColor: avgTransaction === opt.value ? "var(--nb-blue)" : "var(--nb-bg)",
                      color: avgTransaction === opt.value ? "#fff" : "var(--nb-muted)",
                      border: `1px solid ${avgTransaction === opt.value ? "var(--nb-blue)" : "var(--nb-border)"}`,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-muted)", border: "1px solid var(--nb-border)" }}>
                  ← Back
                </button>
                <button onClick={handleFinish} disabled={saving}
                  className="flex-1 py-3 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: saving ? "var(--nb-muted)" : "var(--nb-blue)" }}>
                  {saving ? "Saving…" : "Get my offers →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
