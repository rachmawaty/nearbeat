import { ContextBundle, OfferResponse, Offer } from "@/lib/types";
import { generateOffersWithClaude } from "./claude";
import { generateOffersWithOpenAI } from "./openai";

// Fallback offers per persona when AI call fails
const FALLBACK_OFFERS: Record<string, Offer[]> = {
  maya: [
    { merchant_id: "cafe-rossa", merchant_name: "Cafe Rossa", offer: "15% off any latte", reason: "You pass Cafe Rossa every Tuesday morning on your commute.", signal_used: "habit" },
    { merchant_id: "gymfuel", merchant_name: "GymFuel", offer: "Free shaker bottle with protein purchase", reason: "You have gym scheduled at 6pm tonight.", signal_used: "schedule" },
    { merchant_id: "urban-pharmacy", merchant_name: "Urban Pharmacy", offer: "Skip-the-queue appointment booking", reason: "Urban Pharmacy is 22 minutes ahead on your route.", signal_used: "route" },
  ],
  carlos: [
    { merchant_id: "maru-sushi", merchant_name: "Maru Sushi", offer: "Complimentary miso soup with any bento", reason: "You have client lunch at Maru Sushi in 5 minutes.", signal_used: "schedule" },
    { merchant_id: "the-wine-room", merchant_name: "The Wine Room", offer: "10% off first bottle purchase", reason: "You frequently visit The Wine Room on Wednesday evenings.", signal_used: "habit" },
    { merchant_id: "espresso-bar", merchant_name: "Espresso Bar", offer: "Double points before 9am", reason: "Espresso Bar is on your regular Wednesday route.", signal_used: "route" },
  ],
  priya: [
    { merchant_id: "green-market", merchant_name: "Green Market", offer: "Free tote bag with $40+ spend", reason: "You do your Saturday grocery run here most weekends.", signal_used: "habit" },
    { merchant_id: "little-bloom", merchant_name: "Little Bloom", offer: "20% off organic snacks range", reason: "Little Bloom is 25 minutes ahead on your Saturday errand loop.", signal_used: "route" },
    { merchant_id: "nature-basket", merchant_name: "Nature Basket", offer: "Triple loyalty points Saturday only", reason: "Today is Saturday — triple points day at Nature Basket.", signal_used: "schedule" },
  ],
};

export async function generateOffers(
  context: ContextBundle,
  personaKey: string
): Promise<OfferResponse> {
  const provider = process.env.AI_PROVIDER || "claude";

  try {
    if (provider === "openai") {
      return await generateOffersWithOpenAI(context);
    }
    return await generateOffersWithClaude(context);
  } catch (error) {
    console.error(`[Nearbeat] AI provider "${provider}" failed:`, error);
    const fallback = FALLBACK_OFFERS[personaKey] ?? FALLBACK_OFFERS["maya"];
    return { offers: fallback };
  }
}
