import { generateOffers } from "@/lib/ai";
import { mayaContext, carlosContext, priyaContext } from "@/data/personas";

// Mock both providers so no real API calls are made
jest.mock("@/lib/ai/claude", () => ({
  generateOffersWithClaude: jest.fn().mockRejectedValue(new Error("No API key")),
}));

jest.mock("@/lib/ai/openai", () => ({
  generateOffersWithOpenAI: jest.fn().mockRejectedValue(new Error("No API key")),
}));

describe("generateOffers fallback", () => {
  it("returns 3 fallback offers for maya when AI fails", async () => {
    const result = await generateOffers(mayaContext, "maya");
    expect(result.offers).toHaveLength(3);
  });

  it("returns 3 fallback offers for carlos when AI fails", async () => {
    const result = await generateOffers(carlosContext, "carlos");
    expect(result.offers).toHaveLength(3);
  });

  it("returns 3 fallback offers for priya when AI fails", async () => {
    const result = await generateOffers(priyaContext, "priya");
    expect(result.offers).toHaveLength(3);
  });

  it("fallback offers have all required fields", async () => {
    const result = await generateOffers(mayaContext, "maya");
    for (const offer of result.offers) {
      expect(offer.merchant_id).toBeTruthy();
      expect(offer.merchant_name).toBeTruthy();
      expect(offer.offer).toBeTruthy();
      expect(offer.reason).toBeTruthy();
      expect(["route", "schedule", "weather", "spend_history", "habit"]).toContain(
        offer.signal_used
      );
    }
  });

  it("fallback offers for unknown persona defaults to maya fallback", async () => {
    const result = await generateOffers(mayaContext, "unknown");
    expect(result.offers).toHaveLength(3);
  });
});
