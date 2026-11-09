import { Sparkles, MapPin, CloudSun, CalendarDays, Wallet, Mail, Activity, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  onSignIn: () => void;
  onSignUp: () => void;
}

const STEPS = [
  {
    icon: Activity,
    title: "It senses your moment",
    body: "Time of day, weather, where you are and what is on your calendar. A heartbeat checks in every 30 seconds so your offers never go stale.",
  },
  {
    icon: Sparkles,
    title: "An AI agent reasons over it",
    body: "It looks at real merchants nearby and decides what actually fits your habits, not just what is closest.",
  },
  {
    icon: Wallet,
    title: "You get 3 offers worth claiming",
    body: "Time-sensitive, hyper-personalized, with the reasoning shown. Claim in one tap.",
  },
];

const SIGNALS = [
  { icon: MapPin, label: "Location" },
  { icon: CloudSun, label: "Weather" },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Mail, label: "Bookings" },
  { icon: Wallet, label: "Spend habits" },
];

const SAMPLE_OFFERS = [
  { emoji: "☕", name: "Tatte Bakery & Cafe", offer: "Free pastry with any latte before your 9:30 meeting", meta: "210 m · 4 min" },
  { emoji: "🥗", name: "Cava", offer: "Light lunch bowl, 15% off. Rain clears by 1 pm.", meta: "290 m · 5 min" },
  { emoji: "🏋️", name: "Equinox Kendall", offer: "Evening class pass, you have a free slot at 6", meta: "420 m · 8 min" },
];

export function Landing({ onSignIn, onSignUp }: Props) {
  return (
    <div className="min-h-screen w-full">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Nearbeat</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#signals" className="hover:text-foreground transition-colors">Signals</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onSignIn}
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="rounded-full px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-brand)" }}
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 pt-12 pb-16 lg:grid-cols-2 lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> AI city wallet
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Your city, <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>in real time.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
            Nearbeat turns your live context into hyper-personalized local offers, at the moment they matter.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={onSignUp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-opacity hover:opacity-90 sm:w-auto"
              style={{ background: "var(--gradient-brand)" }}
            >
              Create your account <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onSignIn}
              className="w-full rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-card sm:w-auto"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Sample offers preview */}
        <div className="fade-up mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-4 backdrop-blur-md shadow-[var(--shadow-card)] sm:p-5">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">3 offers for you</span>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Heartbeat active
              </span>
            </div>
            <div className="space-y-3">
              {SAMPLE_OFFERS.map((o) => (
                <div key={o.name} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-3.5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">{o.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{o.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{o.offer}</p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{o.meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 px-1 text-center text-[10px] text-muted-foreground">Illustrative examples</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
          <h2 className="text-center font-display text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-card)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals */}
      <section id="signals" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20 text-center">
        <h2 className="font-display text-3xl font-bold">Signals it reads</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          You choose what to connect. Each signal refreshes on its own schedule so offers match right now, not last hour.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SIGNALS.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm font-medium">
              <s.icon className="h-4 w-4 text-primary" /> {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 pb-16 lg:pb-24">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-6 py-12 text-center text-white sm:px-12"
          style={{ background: "var(--gradient-brand)" }}
        >
          <h2 className="font-display text-3xl font-bold">See what's around you right now.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85">Set up takes about a minute.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onSignUp}
              className="w-full rounded-full bg-white px-7 py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Sign up
            </button>
            <button
              onClick={onSignIn}
              className="w-full rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Nearbeat · Your city pulse
      </footer>
    </div>
  );
}
