# CityPulse — Brainstorm & Context Doc
## MIT AI Hackathon 2026 · Challenge 1: Generative City-Wallet
### For Claude Code — full project context

> **Replace "CityPulse" with final chosen name before starting build**

---

## What we're building

An AI-powered generative wallet that connects a person's real-time context — location, time of day, daily schedule, habitual commute routes, spend history, and calendar — to hyper-personalized local merchant offers. The AI doesn't just know where you are. It knows where you're going, what you usually do on Tuesdays, and that it's raining. Every offer comes with a one-sentence reason citing the exact signal that triggered it. That explainability is the core differentiator.

**Hackathon challenge:** Challenge 1 — Generative City-Wallet, sponsored by DSV Gruppe  
**Solo builder:** Rachmawaty Sudirman (MIT Sloan Fellows MBA 2026)  
**Time budget:** 10 hours  
**Target:** Live Vercel URL + 2-minute demo for judges

---

## The core insight

Most wallet/loyalty apps do static personalization: "you like coffee." We do temporal routine intelligence: "you pass Cafe Rossa every Tuesday at 8:20am and it's raining today." Amazon and Google have this for e-commerce. Local merchants have nothing. We give the corner café the same algorithmic edge.

**The killer demo moment:** Switch persona from "morning commuter" to "date night professional" — watch offers completely regenerate live. Read the AI's reasons aloud. Judges feel the magic.

---

## What makes this different from other teams

1. **Schedule + route layer** — not just location, but WHERE YOU'RE GOING and WHEN
2. **Signal citation** — every offer explains itself in one sentence anchored to a specific data point
3. **Temporal pattern recognition** — recurring habits (gym on Tuesdays, client lunch on Wednesdays) surface relevant offers before the moment, not after
4. **Builder's edge** — Rach has recommendation engine experience; she designs context signals first, then prompts, not the other way around

---

## The 3 signal layers

### Layer 1 — Base context (what most teams will build)
- Current location / neighborhood
- Time of day
- Spend history / purchase categories
- Weather

### Layer 2 — Schedule + route intelligence (our differentiator)
- Daily schedule with specific events (9am standup, 6pm gym)
- Today's route with named waypoints
- Upcoming waypoints with ETA in minutes
- Recurring weekly patterns (Tue/Thu gym, Wed client lunch)

### Layer 3 — Predictive intent (derived from Layer 2)
- "In 15 minutes she passes Cafe Rossa"
- "It's Tuesday 6pm — gym is in the schedule"
- "Post-gym = protein shop window"

---

## The 3 demo personas

### Maya — UX Designer (morning commute)
```json
{
  "persona": { "name": "Maya", "occupation": "UX Designer", "age_bracket": "30s" },
  "temporal": {
    "current_time": "8:05am Tuesday",
    "current_date": "2026-04-29",
    "time_of_day_label": "morning_commute"
  },
  "location": {
    "current_area": "Harrison St, near subway",
    "city": "Boston",
    "neighborhood": "South End"
  },
  "route": {
    "route_today": ["Home (South End)", "Harrison St subway", "Design District office"],
    "upcoming_waypoints": [
      { "name": "Cafe Rossa", "eta_minutes": 15, "type": "merchant" },
      { "name": "Urban Pharmacy", "eta_minutes": 22, "type": "merchant" }
    ],
    "common_routes": [
      { "label": "Daily commute", "days": ["Mon","Tue","Wed","Thu","Fri"], "passes": ["Cafe Rossa", "Morning Bread", "Urban Pharmacy"] }
    ]
  },
  "schedule": {
    "today": [
      { "time": "9:00am", "event": "Team standup" },
      { "time": "12:00pm", "event": "Lunch break" },
      { "time": "6:00pm", "event": "Gym" }
    ],
    "recurring_patterns": [
      { "days": ["Tue","Thu"], "pattern": "Evening gym session" },
      { "days": ["Mon","Tue","Wed","Thu","Fri"], "pattern": "Morning coffee on commute" }
    ]
  },
  "spend_history": {
    "frequent_categories": ["coffee", "health_supplements", "workout_gear"],
    "recent_merchants": ["Cafe Rossa", "GymFuel", "Morning Bread"],
    "avg_transaction": "medium"
  },
  "environment": { "weather": "Light rain", "weather_code": "rain" }
}
```

### Carlos — Sales Rep (midday client lunch)
```json
{
  "persona": { "name": "Carlos", "occupation": "Sales Representative", "age_bracket": "30s" },
  "temporal": {
    "current_time": "12:10pm Wednesday",
    "current_date": "2026-04-30",
    "time_of_day_label": "lunch"
  },
  "location": {
    "current_area": "Downtown Financial District",
    "city": "Boston",
    "neighborhood": "Financial District"
  },
  "route": {
    "route_today": ["Office (FiDi)", "Maru Sushi (client lunch)", "Back to office", "Evening: Fort Point"],
    "upcoming_waypoints": [
      { "name": "Maru Sushi", "eta_minutes": 5, "type": "merchant" },
      { "name": "The Wine Room", "eta_minutes": 180, "type": "merchant" }
    ],
    "common_routes": [
      { "label": "Wednesday client lunch route", "days": ["Wed"], "passes": ["Maru Sushi", "The Wine Room", "Espresso Bar"] },
      { "label": "Friday team drinks", "days": ["Fri"], "passes": ["The Wine Room", "Fort Point Tap"] }
    ]
  },
  "schedule": {
    "today": [
      { "time": "12:30pm", "event": "Client lunch — Maru Sushi" },
      { "time": "3:00pm", "event": "Quarterly review call" },
      { "time": "6:30pm", "event": "Team drinks (optional)" }
    ],
    "recurring_patterns": [
      { "days": ["Wed"], "pattern": "Client lunch in FiDi" },
      { "days": ["Fri"], "pattern": "Team drinks at Fort Point" }
    ]
  },
  "spend_history": {
    "frequent_categories": ["business_dining", "rideshare", "wine_spirits"],
    "recent_merchants": ["Maru Sushi", "The Wine Room", "Uber"],
    "avg_transaction": "high"
  },
  "environment": { "weather": "Sunny, 22°C", "weather_code": "sunny" }
}
```

### Priya — New Mom (weekend errands)
```json
{
  "persona": { "name": "Priya", "occupation": "Product Manager (maternity leave)", "age_bracket": "30s" },
  "temporal": {
    "current_time": "10:30am Saturday",
    "current_date": "2026-05-02",
    "time_of_day_label": "morning"
  },
  "location": {
    "current_area": "Park-side residential",
    "city": "Boston",
    "neighborhood": "Jamaica Plain"
  },
  "route": {
    "route_today": ["Home", "Riverside Park (baby walk)", "Green Market", "Little Bloom"],
    "upcoming_waypoints": [
      { "name": "Green Market farmers stand", "eta_minutes": 10, "type": "merchant" },
      { "name": "Little Bloom", "eta_minutes": 25, "type": "merchant" }
    ],
    "common_routes": [
      { "label": "Saturday errand loop", "days": ["Sat"], "passes": ["Green Market", "Little Bloom", "Morning Bread"] },
      { "label": "Sunday meal prep run", "days": ["Sun"], "passes": ["Green Market", "Urban Pharmacy"] }
    ]
  },
  "schedule": {
    "today": [
      { "time": "10:00am", "event": "Park walk with baby" },
      { "time": "11:30am", "event": "Groceries — Green Market" },
      { "time": "1:00pm", "event": "Nap time (home)" }
    ],
    "recurring_patterns": [
      { "days": ["Sat"], "pattern": "Morning park + grocery run" },
      { "days": ["Sun"], "pattern": "Meal prep grocery shop" }
    ]
  },
  "spend_history": {
    "frequent_categories": ["organic_groceries", "baby_products", "health_wellness"],
    "recent_merchants": ["Green Market", "Little Bloom", "Urban Pharmacy"],
    "avg_transaction": "medium"
  },
  "environment": { "weather": "Clear and breezy", "weather_code": "sunny" }
}
```

---

## Full context bundle schema

```typescript
interface ContextBundle {
  persona: {
    name: string;
    occupation: string;
    age_bracket: "20s" | "30s" | "40s";
  };
  temporal: {
    current_time: string;           // "8:05am Tuesday"
    current_date: string;           // "YYYY-MM-DD"
    time_of_day_label: "morning_commute" | "lunch" | "afternoon" | "evening" | "post_gym" | "morning" | "night";
  };
  location: {
    current_area: string;
    city: string;
    neighborhood: string;
  };
  route: {
    route_today: string[];
    upcoming_waypoints: Array<{
      name: string;
      eta_minutes: number;
      type: "merchant" | "transit" | "destination";
    }>;
    common_routes: Array<{
      label: string;
      days: string[];
      passes: string[];
    }>;
  };
  schedule: {
    today: Array<{ time: string; event: string }>;
    recurring_patterns: Array<{ days: string[]; pattern: string }>;
  };
  spend_history: {
    frequent_categories: string[];
    recent_merchants: string[];
    avg_transaction: "low" | "medium" | "high";
  };
  environment: {
    weather: string;
    weather_code: "rain" | "sunny" | "cloudy" | "snow";
  };
  merchants_nearby: Array<{
    id: string;
    name: string;
    category: "coffee" | "food" | "health" | "retail" | "services" | "baby" | "grocery";
    distance_meters: number;
    on_route: boolean;
    available_offer: {
      type: "discount" | "freebie" | "upgrade" | "loyalty";
      description: string;
      value: string;
    };
  }>;
}
```

---

## Claude system prompt (copy verbatim into `/lib/claude.ts`)

```
You are [APP NAME], an AI offer agent embedded in a smart city wallet.
You receive a JSON context bundle describing a person's real-time situation:
their location, time of day, daily schedule, habitual route, upcoming
waypoints, spend history, and nearby merchants with available offers.

Your job: return EXACTLY 3 personalized offers from the merchants_nearby list.

Rules:
1. Each offer must feel earned, not generic.
2. Every offer MUST include a reason that cites a specific signal from the
   context (schedule, route, weather, spend history, or recurring habit).
3. Reason must be 1 sentence, max 20 words, written in second person ("you").
4. Rank by: (a) on the person's route today, (b) matches current
   time/schedule, (c) aligns with spend history or recurring pattern.
5. Never recommend a merchant not in merchants_nearby.
6. Never invent offers not in available_offer fields.
7. Prefer merchants where on_route = true and eta_minutes < 30.

Return JSON only — no preamble, no markdown fences:
{
  "offers": [
    {
      "merchant_id": "string",
      "merchant_name": "string",
      "offer": "string",
      "reason": "string",
      "signal_used": "route" | "schedule" | "weather" | "spend_history" | "habit"
    }
  ]
}
```

---

## Merchant seed catalog (15 merchants)

```typescript
export const merchants = [
  // Coffee
  { id: "cafe-rossa", name: "Cafe Rossa", category: "coffee", distance_meters: 120, on_route_for: ["maya"], available_offer: { type: "discount", description: "15% off any latte", value: "15%" } },
  { id: "morning-bread", name: "Morning Bread", category: "coffee", distance_meters: 60, on_route_for: ["maya","priya"], available_offer: { type: "freebie", description: "Free pastry with any coffee", value: "free pastry" } },
  { id: "espresso-bar", name: "Espresso Bar", category: "coffee", distance_meters: 200, on_route_for: ["carlos"], available_offer: { type: "loyalty", description: "Double points before 9am", value: "2x points" } },

  // Food
  { id: "maru-sushi", name: "Maru Sushi", category: "food", distance_meters: 200, on_route_for: ["carlos"], available_offer: { type: "freebie", description: "Complimentary miso soup with any bento", value: "free miso" } },
  { id: "the-grain", name: "The Grain", category: "food", distance_meters: 180, on_route_for: ["maya"], available_offer: { type: "discount", description: "Lunch bowl 10% off noon-2pm", value: "10%" } },
  { id: "park-deli", name: "Park Deli", category: "food", distance_meters: 100, on_route_for: ["priya"], available_offer: { type: "upgrade", description: "Free drink upgrade with any sandwich", value: "free upgrade" } },

  // Health
  { id: "gymfuel", name: "GymFuel", category: "health", distance_meters: 80, on_route_for: ["maya"], available_offer: { type: "freebie", description: "Free shaker bottle with protein purchase", value: "free shaker" } },
  { id: "fitStop", name: "FitStop", category: "health", distance_meters: 400, on_route_for: ["maya"], available_offer: { type: "discount", description: "Drop-in class $5 off", value: "$5 off" } },
  { id: "urban-pharmacy", name: "Urban Pharmacy", category: "services", distance_meters: 90, on_route_for: ["maya","priya"], available_offer: { type: "upgrade", description: "Skip-the-queue appointment booking", value: "priority slot" } },

  // Retail / Specialty
  { id: "the-wine-room", name: "The Wine Room", category: "retail", distance_meters: 300, on_route_for: ["carlos"], available_offer: { type: "discount", description: "10% off first bottle purchase", value: "10%" } },
  { id: "pixel-print", name: "Pixel Print", category: "services", distance_meters: 180, on_route_for: ["maya"], available_offer: { type: "discount", description: "Same-day prints 20% off", value: "20%" } },

  // Grocery / Baby
  { id: "green-market", name: "Green Market", category: "grocery", distance_meters: 150, on_route_for: ["priya"], available_offer: { type: "freebie", description: "Free tote bag with $40+ spend", value: "free tote" } },
  { id: "little-bloom", name: "Little Bloom", category: "baby", distance_meters: 250, on_route_for: ["priya"], available_offer: { type: "discount", description: "20% off organic snacks range", value: "20%" } },
  { id: "nature-basket", name: "Nature Basket", category: "grocery", distance_meters: 220, on_route_for: ["priya"], available_offer: { type: "loyalty", description: "Triple loyalty points Saturday only", value: "3x points" } },
  { id: "fort-point-tap", name: "Fort Point Tap", category: "food", distance_meters: 350, on_route_for: ["carlos"], available_offer: { type: "freebie", description: "First round on the house Fridays", value: "free round" } },
];
```

---

## Recommended tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | API routes + React in one repo |
| Styling | Tailwind CSS + shadcn/ui | Wallet card UI fast, no custom CSS |
| AI | Claude claude-sonnet-4-5 via Anthropic SDK | Best context reasoning |
| State | React useState / Context | No Redux needed |
| Data | Hardcoded JSON/TS files | Zero DB setup, demo-ready |
| Streaming | Vercel AI SDK | Typing animation hides latency |
| Deploy | Vercel | One-click, live URL in minutes |

---

## Project file structure

```
[app-name]/
├── app/
│   ├── page.tsx                  # Main wallet UI — persona switcher + offer feed
│   ├── api/
│   │   └── offers/
│   │       └── route.ts          # POST endpoint — receives persona key, returns 3 offers
│   └── layout.tsx
├── components/
│   ├── ContextBar.tsx            # Top strip: time · location · weather · next waypoint
│   ├── OfferCard.tsx             # Single offer: merchant · deal · reason · signal badge
│   ├── OfferFeed.tsx             # 3-card feed with skeleton loading state
│   ├── PersonaSwitcher.tsx       # Tab or dropdown — Maya / Carlos / Priya
│   └── ClaimModal.tsx            # Mock confirmation on offer tap
├── data/
│   ├── personas.ts               # 3 full context bundle JSONs (see above)
│   └── merchants.ts              # 15 merchant catalog (see above)
├── lib/
│   ├── claude.ts                 # Anthropic SDK wrapper, system prompt, offer parser
│   └── types.ts                  # TypeScript interfaces for ContextBundle, Offer, Merchant
└── public/
```

---

## 10-hour build plan

| Phase | Time | Goal | Done when |
|---|---|---|---|
| 1 — Scaffold | 0–1.5h | Next.js app, Tailwind, shadcn, env vars, deploy to Vercel | Blank page live at URL |
| 2 — Data + API | 1.5–4h | personas.ts, merchants.ts, /api/offers route working, Claude prompt live | curl returns 3 offers |
| 3 — UI | 4–6.5h | ContextBar, OfferCard, OfferFeed, PersonaSwitcher all rendering | Persona switch shows different offers |
| 4 — Polish | 6.5–9h | Signal badges, loading skeleton, claim modal, pre-cache on load, demo rehearsed | 3 clean demo runs with no errors |
| 5 — Pitch | 9–10h | 3-slide deck, 2-min script locked | Ready to present |

---

## Key engineering decisions

**Latency strategy:** Pre-generate and cache all 3 persona offer sets on app load. Persona switch reveals cached offers instantly and fires a background refresh. Judges see zero wait time.

**Streaming:** Use Vercel AI SDK streaming on the API route. Show a typing animation while offers load. Never show a blank screen.

**Error handling:** Always have a fallback set of hardcoded offers per persona. If Claude API fails, show fallback silently.

**No real APIs needed:** Location = hardcoded. Calendar = hardcoded in persona JSON. Weather = hardcoded. Maps = optional SVG schematic. Payments = mock confirmation screen. Judges judge the idea, not the infra.

---

## The 2-minute pitch structure

1. **Hook (15s):** "Your city already knows your patterns. It just doesn't use them yet."
2. **Problem (20s):** Local merchants have no personalization engine. Global e-commerce does.
3. **Demo (60s):** Live persona switch — read the AI's reasons aloud.
4. **Insight (15s):** "We don't just know where you are. We know where you're going, and what you do on Tuesdays."
5. **Close (10s):** "This is what it looks like when the city actually knows you."

---

## Scope — what NOT to build

- Real GPS / maps integration
- Real payment processing
- Real calendar API (Google Calendar etc.)
- Real weather API (hardcode it)
- User authentication
- Merchant dashboard / admin
- Push notifications

All of the above are v2 stories. Tell them verbally if judges ask.

---

## Prompt for Claude Code to start building

> "Build a Next.js 14 app called [APP NAME] — an AI-powered city wallet. Use the full project structure, TypeScript interfaces, persona data, merchant catalog, and Claude system prompt defined in this brainstorm document. Start with: (1) Next.js scaffold with Tailwind + shadcn, (2) data files for personas and merchants, (3) the /api/offers POST endpoint using the Anthropic SDK with the exact system prompt above, (4) ContextBar and OfferCard components. Deploy target: Vercel."

---

*Brainstorm doc generated during MIT AI Hackathon 2026 · April 25, 2026*
*Built with Claude — challenge 1: Generative City-Wallet*
