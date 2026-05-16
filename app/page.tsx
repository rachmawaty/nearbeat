"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PERSONAS, type Offer } from "@/data/nearbeat";
import { ContextBar } from "@/components/nearbeat/ContextBar";
import { IntegrationStatusBar } from "@/components/nearbeat/IntegrationStatusBar";
import { OfferCard } from "@/components/nearbeat/OfferCard";
import { LiveContextDrawer } from "@/components/nearbeat/LiveContextDrawer";
import { Login } from "@/components/nearbeat/Login";
import { ThemeToggle } from "@/components/nearbeat/ThemeToggle";
import { AgentThinking } from "@/components/nearbeat/AgentThinking";
import { PersonaSwitcher } from "@/components/nearbeat/PersonaSwitcher";
import { useAgent } from "@/hooks/useAgent";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { Sparkles, LogOut } from "lucide-react";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function Home() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [time, setTime] = useState(() => formatTime(new Date()));

  const agent = useAgent();

  const persona = useMemo(
    () => PERSONAS.find((p) => p.key === activeKey) ?? PERSONAS[0],
    [activeKey]
  );

  const activeOffers: Offer[] = agent.result?.offers ?? persona.offers;

  const runAgent = useCallback(() => { agent.run(persona); }, [agent, persona]);

  const heartbeat = useHeartbeat(
    useCallback(() => {}, []),
    15
  );

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { agent.reset(); }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeKey) return <Login onPick={(k) => setActiveKey(k)} />;

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-5 mx-auto max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg lg:text-xl font-bold leading-none">Nearbeat</h1>
            <p className="text-[10px] lg:text-xs text-muted-foreground">Your city pulse</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <LiveContextDrawer persona={persona} />
          <ThemeToggle />
          <button
            onClick={() => setActiveKey(null)}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Switch account"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Switch</span>
          </button>
        </div>
      </header>

      {/* Persona switcher */}
      <div className="mb-5">
        <PersonaSwitcher active={activeKey} onChange={(k) => setActiveKey(k)} />
      </div>

      <section key={persona.key} className="fade-up grid gap-5 lg:gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr]">
        {/* LEFT — context + agent */}
        <div className="space-y-4 lg:space-y-5 lg:sticky lg:top-5 lg:self-start">
          <ContextBar persona={persona} time={time} />

          <div>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live signals</span>
              <span className="hidden lg:inline text-[10px] text-muted-foreground">Heartbeat active</span>
            </div>
            <IntegrationStatusBar />
          </div>

          <AgentThinking
            steps={agent.steps}
            loading={agent.loading}
            reasoning={agent.result?.agent_reasoning}
            signals={agent.result?.signals_active}
            error={agent.error}
            onRun={runAgent}
            hasResult={!!agent.result}
            stale={heartbeat.stale}
            minutesSince={heartbeat.minutesSince}
          />
        </div>

        {/* RIGHT — offers */}
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {agent.result ? "AI-generated offers · just now" : "3 offers for you"}
            </span>
            {agent.result && (
              <span className="text-[10px] text-muted-foreground">
                ✦ {agent.result._input_tokens + agent.result._output_tokens} tokens
              </span>
            )}
          </div>

          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {(agent.loading ? persona.offers : activeOffers).map((o, i) => (
              <div key={o.merchant_id} className={`fade-up ${agent.loading ? "opacity-40" : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
                <OfferCard offer={o} onClaim={() => {}} index={i} />
              </div>
            ))}
          </div>

          <footer className="pt-8 pb-8 text-center">
            <p className="text-[10px] lg:text-xs text-muted-foreground">
              Nearbeat
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
