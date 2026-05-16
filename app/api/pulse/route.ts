import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Persona, Offer } from "@/data/nearbeat";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Nearbeat, an AI offer agent embedded in a smart city wallet.
You receive a JSON persona bundle with the person's location, schedule, route, spend history, health data, and email bookings.

Your job: return EXACTLY 3 personalised offers. Each offer must:
1. Feel earned, not generic — cite a specific signal.
2. Include a reason (1 sentence, max 20 words, second person "you").
3. Include a value string (e.g. "Save $2.40", "BOGO", "Free").

Return JSON only, no markdown:
{
  "offers": [
    {
      "merchant_id": "string",
      "merchant_name": "string",
      "merchant_emoji": "emoji",
      "category": "short category description",
      "offer": "string",
      "value": "string",
      "reason": "string",
      "signal_used": "route"|"schedule"|"habit"|"weather"|"spend"|"health"|"email",
      "data_source": "google_maps"|"google_calendar"|"plaid"|"gmail"|"healthkit"|"openweather",
      "distance_m": number,
      "eta_min": number
    }
  ],
  "agent_reasoning": "1-2 sentences on which signals dominated",
  "signals_active": ["signal1", "signal2"]
}`;

export async function POST(req: NextRequest) {
  const { persona } = await req.json() as { persona: Persona };

  if (!persona?.key) {
    return NextResponse.json({ error: "Missing persona" }, { status: 400 });
  }

  const startTokens = { input: 0, output: 0 };

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(persona) }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());

    return NextResponse.json({
      offers: parsed.offers as Offer[],
      agent_reasoning: parsed.agent_reasoning ?? "",
      signals_active: parsed.signals_active ?? [],
      _steps: [],
      _input_tokens: message.usage.input_tokens,
      _output_tokens: message.usage.output_tokens,
    });
  } catch (err) {
    console.error("[/api/pulse] error:", err);
    // Return persona's hardcoded offers as fallback
    return NextResponse.json({
      offers: persona.offers,
      agent_reasoning: "Using cached offers (AI unavailable).",
      signals_active: [],
      _steps: [],
      _input_tokens: startTokens.input,
      _output_tokens: startTokens.output,
    });
  }
}
