import { useState, useCallback } from "react";
import type { Offer, Persona } from "@/data/nearbeat";

export type AgentStep = { tool: string; input: unknown; result: unknown };

export interface AgentResult {
  offers: Offer[];
  agent_reasoning: string;
  signals_active: string[];
  _steps: AgentStep[];
  _input_tokens: number;
  _output_tokens: number;
}

export interface LiveContext {
  lat: number;
  lon: number;
  city: string;
  weather: { temp: number; label: string };
  schedule?: { time: string; event: string; location?: string }[];
}

export interface UseAgentReturn {
  result: AgentResult | null;
  loading: boolean;
  error: string | null;
  steps: AgentStep[];
  run: (persona: Persona, liveContext?: LiveContext) => Promise<void>;
  reset: () => void;
}

const AGENT_URL = import.meta.env.VITE_AGENT_URL ?? "/api/pulse";

export function useAgent(): UseAgentReturn {
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([]);

  const run = useCallback(async (persona: Persona, liveContext?: LiveContext) => {
    setLoading(true);
    setError(null);
    setSteps([]);

    try {
      const res = await fetch(AGENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, liveContext }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Agent returned ${res.status}`);
      }

      const data: AgentResult = await res.json();
      setResult(data);
      setSteps(data._steps ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent error");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setSteps([]);
  }, []);

  return { result, loading, error, steps, run, reset };
}
