import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PERSONAS, type Offer } from "@/data/nearbeat";
import { ContextBar } from "@/components/nearbeat/ContextBar";
import { IntegrationStatusBar } from "@/components/nearbeat/IntegrationStatusBar";
import { OfferCard } from "@/components/nearbeat/OfferCard";
import { LiveContextDrawer } from "@/components/nearbeat/LiveContextDrawer";
import { ThemeToggle } from "@/components/nearbeat/ThemeToggle";
import { AgentThinking } from "@/components/nearbeat/AgentThinking";
import { useAgent } from "@/hooks/useAgent";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function DemoUser() {
  const { personaKey } = useParams<{ personaKey: string }>();
  const navigate = useNavigate();
  const [time, setTime] = useState(() => formatTime(new Date()));

  const persona = PERSONAS.find((p) => p.key === personaKey) ?? PERSONAS[0];
  const agent = useAgent();

  const activeOffers: Offer[] = agent.result?.offers ?? persona.offers;

  const runAgent = useCallback(() => { agent.run(persona); }, [agent, persona]);

  const heartbeat = useHeartbeat(
    useCallback((reason: string) => {
      toast({ title: "Context updated", description: reason });
    }, []),
    15
  );

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  // Reset agent when persona changes
  useEffect(() => { agent.reset(); }, [persona.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClaim = (o: Offer) => {
    toast({ title: `${o.merchant_name} — claimed`, description: o.offer });
  };

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-5 mx-auto max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl">
      <header className="mb-6 flex items-center justify-between">
        {/* Left: logo + persona identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-lg flex-shrink-0">
              {persona.avatar}
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-sm leading-none">{persona.name}</span>
                <span className="text-xs text-muted-foreground">{persona.occupation}</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                {persona.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1">
          <LiveContextDrawer persona={persona} />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/demo")}
            className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Switch user</span>
          </Button>
        </div>
      </header>

      <section className="fade-up grid gap-5 lg:gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr]">
        {/* LEFT */}
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

        {/* RIGHT */}
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {agent.result ? "AI-generated offers · just now" : "3 offers for you · just now"}
            </span>
            {agent.result && (
              <span className="text-[10px] text-muted-foreground">
                ✦ {agent.result._input_tokens + agent.result._output_tokens} tokens
              </span>
            )}
          </div>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {(agent.loading ? persona.offers : activeOffers).map((o, i) => (
              <div
                key={o.merchant_id}
                className={`fade-up ${agent.loading ? "opacity-40" : ""}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <OfferCard offer={o} onClaim={handleClaim} index={i} />
              </div>
            ))}
          </div>
          <footer className="pt-8 pb-8 text-center">
            <p className="text-[10px] lg:text-xs text-muted-foreground">
              Prototype · MIT AI Hackathon 2026 · Generative City Wallet
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
