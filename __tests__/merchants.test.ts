import { merchants, getMerchantsForPersona } from "@/data/merchants";

describe("merchants catalog", () => {
  it("has exactly 15 merchants", () => {
    expect(merchants).toHaveLength(15);
  });

  it("all merchants have required fields", () => {
    for (const m of merchants) {
      expect(m.id).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.category).toBeTruthy();
      expect(m.distance_meters).toBeGreaterThan(0);
      expect(m.available_offer.type).toBeTruthy();
      expect(m.available_offer.description).toBeTruthy();
      expect(m.available_offer.value).toBeTruthy();
    }
  });

  it("all merchant IDs are unique", () => {
    const ids = merchants.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getMerchantsForPersona", () => {
  it("returns only merchants on maya's route", () => {
    const result = getMerchantsForPersona("maya");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((m) => expect(m.on_route).toBe(true));
  });

  it("returns only merchants on carlos's route", () => {
    const result = getMerchantsForPersona("carlos");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((m) => expect(m.on_route).toBe(true));
  });

  it("returns only merchants on priya's route", () => {
    const result = getMerchantsForPersona("priya");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((m) => expect(m.on_route).toBe(true));
  });

  it("strips on_route_for from returned objects", () => {
    const result = getMerchantsForPersona("maya");
    result.forEach((m) => expect(m).not.toHaveProperty("on_route_for"));
  });

  it("maya gets cafe-rossa", () => {
    const result = getMerchantsForPersona("maya");
    expect(result.find((m) => m.id === "cafe-rossa")).toBeDefined();
  });

  it("carlos gets maru-sushi", () => {
    const result = getMerchantsForPersona("carlos");
    expect(result.find((m) => m.id === "maru-sushi")).toBeDefined();
  });

  it("priya gets green-market", () => {
    const result = getMerchantsForPersona("priya");
    expect(result.find((m) => m.id === "green-market")).toBeDefined();
  });
});
