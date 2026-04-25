import OpenAI from "openai";
import { ContextBundle, OfferResponse } from "@/lib/types";
import { SYSTEM_PROMPT } from "./prompt";

export async function generateOffersWithOpenAI(
  context: ContextBundle
): Promise<OfferResponse> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(context) },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as OfferResponse;
}
