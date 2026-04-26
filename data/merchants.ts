export type PersonaKey = "maya" | "carlos" | "priya";

export type NeighborhoodKey =
  | "south_end" | "back_bay" | "newbury_street" | "beacon_hill"
  | "kendall_square" | "central_square" | "harvard_square"
  | "financial_district" | "jamaica_plain" | "fenway" | "seaport" | "north_end";

export interface MerchantSeed {
  id: string;
  name: string;
  category: "coffee" | "food" | "health" | "retail" | "services" | "baby" | "grocery";
  distance_meters: number;
  on_route_for: PersonaKey[];
  neighborhoods: NeighborhoodKey[];
  available_offer: {
    type: "discount" | "freebie" | "upgrade" | "loyalty";
    description: string;
    value: string;
  };
}

export const merchants: MerchantSeed[] = [
  // ─── Original demo merchants ───────────────────────────────────────────────

  // Coffee
  { id: "cafe-rossa", name: "Cafe Rossa", category: "coffee", distance_meters: 120, on_route_for: ["maya"], neighborhoods: ["south_end", "back_bay"], available_offer: { type: "discount", description: "15% off any latte", value: "15%" } },
  { id: "morning-bread", name: "Morning Bread", category: "coffee", distance_meters: 60, on_route_for: ["maya", "priya"], neighborhoods: ["south_end", "jamaica_plain"], available_offer: { type: "freebie", description: "Free pastry with any coffee", value: "free pastry" } },
  { id: "espresso-bar", name: "Espresso Bar", category: "coffee", distance_meters: 200, on_route_for: ["carlos"], neighborhoods: ["financial_district"], available_offer: { type: "loyalty", description: "Double points before 9am", value: "2x points" } },

  // Food
  { id: "maru-sushi", name: "Maru Sushi", category: "food", distance_meters: 200, on_route_for: ["carlos"], neighborhoods: ["financial_district"], available_offer: { type: "freebie", description: "Complimentary miso soup with any bento", value: "free miso" } },
  { id: "the-grain", name: "The Grain", category: "food", distance_meters: 180, on_route_for: ["maya"], neighborhoods: ["south_end", "back_bay"], available_offer: { type: "discount", description: "Lunch bowl 10% off noon-2pm", value: "10%" } },
  { id: "park-deli", name: "Park Deli", category: "food", distance_meters: 100, on_route_for: ["priya"], neighborhoods: ["jamaica_plain"], available_offer: { type: "upgrade", description: "Free drink upgrade with any sandwich", value: "free upgrade" } },

  // Health
  { id: "gymfuel", name: "GymFuel", category: "health", distance_meters: 80, on_route_for: ["maya"], neighborhoods: ["south_end", "back_bay"], available_offer: { type: "freebie", description: "Free shaker bottle with protein purchase", value: "free shaker" } },
  { id: "fitstop", name: "FitStop", category: "health", distance_meters: 400, on_route_for: ["maya"], neighborhoods: ["south_end"], available_offer: { type: "discount", description: "Drop-in class $5 off", value: "$5 off" } },
  { id: "urban-pharmacy", name: "Urban Pharmacy", category: "services", distance_meters: 90, on_route_for: ["maya", "priya"], neighborhoods: ["south_end", "jamaica_plain"], available_offer: { type: "upgrade", description: "Skip-the-queue appointment booking", value: "priority slot" } },

  // Retail / Specialty
  { id: "the-wine-room", name: "The Wine Room", category: "retail", distance_meters: 300, on_route_for: ["carlos"], neighborhoods: ["financial_district", "back_bay"], available_offer: { type: "discount", description: "10% off first bottle purchase", value: "10%" } },
  { id: "pixel-print", name: "Pixel Print", category: "services", distance_meters: 180, on_route_for: ["maya"], neighborhoods: ["south_end"], available_offer: { type: "discount", description: "Same-day prints 20% off", value: "20%" } },

  // Grocery / Baby
  { id: "green-market", name: "Green Market", category: "grocery", distance_meters: 150, on_route_for: ["priya"], neighborhoods: ["jamaica_plain"], available_offer: { type: "freebie", description: "Free tote bag with $40+ spend", value: "free tote" } },
  { id: "little-bloom", name: "Little Bloom", category: "baby", distance_meters: 250, on_route_for: ["priya"], neighborhoods: ["jamaica_plain"], available_offer: { type: "discount", description: "20% off organic snacks range", value: "20%" } },
  { id: "nature-basket", name: "Nature Basket", category: "grocery", distance_meters: 220, on_route_for: ["priya"], neighborhoods: ["jamaica_plain"], available_offer: { type: "loyalty", description: "Triple loyalty points Saturday only", value: "3x points" } },
  { id: "fort-point-tap", name: "Fort Point Tap", category: "food", distance_meters: 350, on_route_for: ["carlos"], neighborhoods: ["seaport", "financial_district"], available_offer: { type: "freebie", description: "First round on the house Fridays", value: "free round" } },

  // ─── Newbury Street (Back Bay) ─────────────────────────────────────────────
  { id: "trident-booksellers", name: "Trident Booksellers & Cafe", category: "coffee", distance_meters: 80, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "discount", description: "10% off books + free drip coffee", value: "10% + free coffee" } },
  { id: "pavement-newbury", name: "Pavement Coffeehouse", category: "coffee", distance_meters: 60, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "loyalty", description: "Stamp #5 earns a free latte", value: "free latte" } },
  { id: "sweetgreen-newbury", name: "Sweetgreen", category: "food", distance_meters: 120, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "discount", description: "15% off warm bowls after 2pm", value: "15%" } },
  { id: "soulcycle-newbury", name: "SoulCycle Newbury", category: "health", distance_meters: 200, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "discount", description: "First class $20 (reg $40)", value: "$20 first class" } },
  { id: "lululemon-newbury", name: "Lululemon Newbury", category: "retail", distance_meters: 150, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "discount", description: "15% off with fitness class receipt", value: "15%" } },
  { id: "cava-newbury", name: "Cava", category: "food", distance_meters: 100, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "freebie", description: "Free pita with any grain bowl", value: "free pita" } },
  { id: "equinox-back-bay", name: "Equinox Back Bay", category: "health", distance_meters: 300, on_route_for: [], neighborhoods: ["newbury_street", "back_bay"], available_offer: { type: "discount", description: "Guest pass — first visit free", value: "free guest pass" } },

  // ─── Kendall Square ────────────────────────────────────────────────────────
  { id: "area-four-kendall", name: "Area Four", category: "food", distance_meters: 100, on_route_for: [], neighborhoods: ["kendall_square"], available_offer: { type: "discount", description: "Lunch prix-fixe $18 (reg $26)", value: "$18 lunch" } },
  { id: "clover-kendall", name: "Clover Food Lab", category: "food", distance_meters: 80, on_route_for: [], neighborhoods: ["kendall_square"], available_offer: { type: "freebie", description: "Free egg sandwich with coffee", value: "free egg sandwich" } },
  { id: "toscanini-kendall", name: "Toscanini's Ice Cream", category: "food", distance_meters: 150, on_route_for: [], neighborhoods: ["kendall_square", "central_square"], available_offer: { type: "freebie", description: "Free scoop on your birthday week", value: "free scoop" } },
  { id: "kendall-brew-house", name: "Kendall Brew House", category: "food", distance_meters: 200, on_route_for: [], neighborhoods: ["kendall_square"], available_offer: { type: "discount", description: "Happy hour 4–6pm — $2 off pints", value: "$2 off pints" } },
  { id: "marathon-sports-kendall", name: "Marathon Sports", category: "retail", distance_meters: 120, on_route_for: [], neighborhoods: ["kendall_square"], available_offer: { type: "discount", description: "10% off with any local gym membership", value: "10%" } },
  { id: "onemedical-kendall", name: "One Medical Kendall", category: "services", distance_meters: 180, on_route_for: [], neighborhoods: ["kendall_square"], available_offer: { type: "upgrade", description: "Same-day appointment — skip the wait", value: "same-day slot" } },

  // ─── Central Square ────────────────────────────────────────────────────────
  { id: "central-bottle", name: "Central Bottle", category: "retail", distance_meters: 90, on_route_for: [], neighborhoods: ["central_square"], available_offer: { type: "discount", description: "10% off natural wine selection", value: "10%" } },
  { id: "flour-central", name: "Flour Bakery + Cafe", category: "coffee", distance_meters: 60, on_route_for: [], neighborhoods: ["central_square"], available_offer: { type: "freebie", description: "Free cookie with any sandwich", value: "free cookie" } },
  { id: "mariposa-central", name: "Mariposa Bakery", category: "food", distance_meters: 80, on_route_for: [], neighborhoods: ["central_square"], available_offer: { type: "discount", description: "20% off after 3pm (day-end special)", value: "20%" } },
  { id: "harvest-coop-central", name: "Harvest Co-op", category: "grocery", distance_meters: 200, on_route_for: [], neighborhoods: ["central_square", "jamaica_plain"], available_offer: { type: "loyalty", description: "Member double-points weekends", value: "2x points" } },
  { id: "zuzu-central", name: "ZuZu", category: "food", distance_meters: 150, on_route_for: [], neighborhoods: ["central_square"], available_offer: { type: "discount", description: "Taco Tuesday — 3 tacos for $12", value: "$12 for 3 tacos" } },
  { id: "middle-east-central", name: "The Middle East", category: "food", distance_meters: 120, on_route_for: [], neighborhoods: ["central_square"], available_offer: { type: "discount", description: "Happy hour 5–7pm, 20% off", value: "20% happy hour" } },

  // ─── Harvard Square ────────────────────────────────────────────────────────
  { id: "crema-harvard", name: "Crema Cafe", category: "coffee", distance_meters: 70, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "loyalty", description: "6th drink free with Crema card", value: "free 6th drink" } },
  { id: "darwin-harvard", name: "Darwin's Ltd", category: "food", distance_meters: 100, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "freebie", description: "Free pickle with any sandwich", value: "free pickle" } },
  { id: "black-ink-harvard", name: "Black Ink", category: "retail", distance_meters: 80, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "discount", description: "15% off stationery and gifts", value: "15%" } },
  { id: "seeds-harvard", name: "SEEDS", category: "food", distance_meters: 120, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "discount", description: "Student + staff lunch deal — $10 bowl", value: "$10 bowl" } },
  { id: "cardullo-harvard", name: "Cardullo's Gourmet", category: "grocery", distance_meters: 60, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "freebie", description: "Free sample with any cheese purchase", value: "free sample" } },
  { id: "club-passim-harvard", name: "Club Passim Cafe", category: "food", distance_meters: 90, on_route_for: [], neighborhoods: ["harvard_square"], available_offer: { type: "discount", description: "Pre-show dinner special — 15% off", value: "15% pre-show" } },
];

export function getMerchantsForPersona(personaKey: PersonaKey) {
  return merchants
    .filter((m) => m.on_route_for.includes(personaKey))
    .map(({ on_route_for, neighborhoods, ...m }) => ({
      ...m,
      on_route: true,
    }));
}

export function getMerchantsForNeighborhood(neighborhood: string) {
  const key = neighborhood.toLowerCase().replace(/\s+/g, "_") as NeighborhoodKey;
  return merchants
    .filter((m) => m.neighborhoods.includes(key))
    .map(({ on_route_for, neighborhoods, ...m }) => ({
      ...m,
      on_route: true,
    }));
}
