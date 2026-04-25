import Anthropic from "@anthropic-ai/sdk";
import { ContextBundle, OfferResponse } from "@/lib/types";
import { SYSTEM_PROMPT } from "./prompt";

export async function generateOffersWithClaude(
  context: ContextBundle
): Promise<OfferResponse> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: JSON.stringify(context),
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as OfferResponse;
}
