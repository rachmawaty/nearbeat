export type PersonaKey = "maya" | "carlos" | "priya";

export interface MerchantSeed {
  id: string;
  name: string;
  category: "coffee" | "food" | "health" | "retail" | "services" | "baby" | "grocery";
  distance_meters: number;
  on_route_for: PersonaKey[];
  available_offer: {
    type: "discount" | "freebie" | "upgrade" | "loyalty";
    description: string;
    value: string;
  };
}

export const merchants: MerchantSeed[] = [
  // Coffee
  { id: "cafe-rossa", name: "Cafe Rossa", category: "coffee", distance_meters: 120, on_route_for: ["maya"], available_offer: { type: "discount", description: "15% off any latte", value: "15%" } },
  { id: "morning-bread", name: "Morning Bread", category: "coffee", distance_meters: 60, on_route_for: ["maya", "priya"], available_offer: { type: "freebie", description: "Free pastry with any coffee", value: "free pastry" } },
  { id: "espresso-bar", name: "Espresso Bar", category: "coffee", distance_meters: 200, on_route_for: ["carlos"], available_offer: { type: "loyalty", description: "Double points before 9am", value: "2x points" } },

  // Food
  { id: "maru-sushi", name: "Maru Sushi", category: "food", distance_meters: 200, on_route_for: ["carlos"], available_offer: { type: "freebie", description: "Complimentary miso soup with any bento", value: "free miso" } },
  { id: "the-grain", name: "The Grain", category: "food", distance_meters: 180, on_route_for: ["maya"], available_offer: { type: "discount", description: "Lunch bowl 10% off noon-2pm", value: "10%" } },
  { id: "park-deli", name: "Park Deli", category: "food", distance_meters: 100, on_route_for: ["priya"], available_offer: { type: "upgrade", description: "Free drink upgrade with any sandwich", value: "free upgrade" } },

  // Health
  { id: "gymfuel", name: "GymFuel", category: "health", distance_meters: 80, on_route_for: ["maya"], available_offer: { type: "freebie", description: "Free shaker bottle with protein purchase", value: "free shaker" } },
  { id: "fitstop", name: "FitStop", category: "health", distance_meters: 400, on_route_for: ["maya"], available_offer: { type: "discount", description: "Drop-in class $5 off", value: "$5 off" } },
  { id: "urban-pharmacy", name: "Urban Pharmacy", category: "services", distance_meters: 90, on_route_for: ["maya", "priya"], available_offer: { type: "upgrade", description: "Skip-the-queue appointment booking", value: "priority slot" } },

  // Retail / Specialty
  { id: "the-wine-room", name: "The Wine Room", category: "retail", distance_meters: 300, on_route_for: ["carlos"], available_offer: { type: "discount", description: "10% off first bottle purchase", value: "10%" } },
  { id: "pixel-print", name: "Pixel Print", category: "services", distance_meters: 180, on_route_for: ["maya"], available_offer: { type: "discount", description: "Same-day prints 20% off", value: "20%" } },

  // Grocery / Baby
  { id: "green-market", name: "Green Market", category: "grocery", distance_meters: 150, on_route_for: ["priya"], available_offer: { type: "freebie", description: "Free tote bag with $40+ spend", value: "free tote" } },
  { id: "little-bloom", name: "Little Bloom", category: "baby", distance_meters: 250, on_route_for: ["priya"], available_offer: { type: "discount", description: "20% off organic snacks range", value: "20%" } },
  { id: "nature-basket", name: "Nature Basket", category: "grocery", distance_meters: 220, on_route_for: ["priya"], available_offer: { type: "loyalty", description: "Triple loyalty points Saturday only", value: "3x points" } },
  { id: "fort-point-tap", name: "Fort Point Tap", category: "food", distance_meters: 350, on_route_for: ["carlos"], available_offer: { type: "freebie", description: "First round on the house Fridays", value: "free round" } },
];

export function getMerchantsForPersona(personaKey: PersonaKey) {
  return merchants
    .filter((m) => m.on_route_for.includes(personaKey))
    .map(({ on_route_for, ...m }) => ({
      ...m,
      on_route: true,
    }));
}
