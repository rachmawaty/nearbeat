import { ContextBundle } from "@/lib/types";
import { getMerchantsForPersona } from "./merchants";

export const mayaContext: ContextBundle = {
  persona: { name: "Maya", occupation: "UX Designer", age_bracket: "30s" },
  temporal: {
    current_time: "8:05am Tuesday",
    current_date: "2026-04-29",
    time_of_day_label: "morning_commute",
  },
  location: {
    current_area: "Harrison St, near subway",
    city: "Boston",
    neighborhood: "South End",
  },
  route: {
    route_today: ["Home (South End)", "Harrison St subway", "Design District office"],
    upcoming_waypoints: [
      { name: "Cafe Rossa", eta_minutes: 15, type: "merchant" },
      { name: "Urban Pharmacy", eta_minutes: 22, type: "merchant" },
    ],
    common_routes: [
      {
        label: "Daily commute",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        passes: ["Cafe Rossa", "Morning Bread", "Urban Pharmacy"],
      },
    ],
  },
  schedule: {
    today: [
      { time: "9:00am", event: "Team standup" },
      { time: "12:00pm", event: "Lunch break" },
      { time: "6:00pm", event: "Gym" },
    ],
    recurring_patterns: [
      { days: ["Tue", "Thu"], pattern: "Evening gym session" },
      { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], pattern: "Morning coffee on commute" },
    ],
  },
  spend_history: {
    frequent_categories: ["coffee", "health_supplements", "workout_gear"],
    recent_merchants: ["Cafe Rossa", "GymFuel", "Morning Bread"],
    avg_transaction: "medium",
  },
  environment: { weather: "Light rain", weather_code: "rain" },
  merchants_nearby: getMerchantsForPersona("maya"),
};

export const carlosContext: ContextBundle = {
  persona: { name: "Carlos", occupation: "Sales Representative", age_bracket: "30s" },
  temporal: {
    current_time: "12:10pm Wednesday",
    current_date: "2026-04-30",
    time_of_day_label: "lunch",
  },
  location: {
    current_area: "Downtown Financial District",
    city: "Boston",
    neighborhood: "Financial District",
  },
  route: {
    route_today: ["Office (FiDi)", "Maru Sushi (client lunch)", "Back to office", "Evening: Fort Point"],
    upcoming_waypoints: [
      { name: "Maru Sushi", eta_minutes: 5, type: "merchant" },
      { name: "The Wine Room", eta_minutes: 180, type: "merchant" },
    ],
    common_routes: [
      {
        label: "Wednesday client lunch route",
        days: ["Wed"],
        passes: ["Maru Sushi", "The Wine Room", "Espresso Bar"],
      },
      {
        label: "Friday team drinks",
        days: ["Fri"],
        passes: ["The Wine Room", "Fort Point Tap"],
      },
    ],
  },
  schedule: {
    today: [
      { time: "12:30pm", event: "Client lunch — Maru Sushi" },
      { time: "3:00pm", event: "Quarterly review call" },
      { time: "6:30pm", event: "Team drinks (optional)" },
    ],
    recurring_patterns: [
      { days: ["Wed"], pattern: "Client lunch in FiDi" },
      { days: ["Fri"], pattern: "Team drinks at Fort Point" },
    ],
  },
  spend_history: {
    frequent_categories: ["business_dining", "rideshare", "wine_spirits"],
    recent_merchants: ["Maru Sushi", "The Wine Room", "Uber"],
    avg_transaction: "high",
  },
  environment: { weather: "Sunny, 22°C", weather_code: "sunny" },
  merchants_nearby: getMerchantsForPersona("carlos"),
};

export const priyaContext: ContextBundle = {
  persona: { name: "Priya", occupation: "Product Manager (maternity leave)", age_bracket: "30s" },
  temporal: {
    current_time: "10:30am Saturday",
    current_date: "2026-05-02",
    time_of_day_label: "morning",
  },
  location: {
    current_area: "Park-side residential",
    city: "Boston",
    neighborhood: "Jamaica Plain",
  },
  route: {
    route_today: ["Home", "Riverside Park (baby walk)", "Green Market", "Little Bloom"],
    upcoming_waypoints: [
      { name: "Green Market farmers stand", eta_minutes: 10, type: "merchant" },
      { name: "Little Bloom", eta_minutes: 25, type: "merchant" },
    ],
    common_routes: [
      {
        label: "Saturday errand loop",
        days: ["Sat"],
        passes: ["Green Market", "Little Bloom", "Morning Bread"],
      },
      {
        label: "Sunday meal prep run",
        days: ["Sun"],
        passes: ["Green Market", "Urban Pharmacy"],
      },
    ],
  },
  schedule: {
    today: [
      { time: "10:00am", event: "Park walk with baby" },
      { time: "11:30am", event: "Groceries — Green Market" },
      { time: "1:00pm", event: "Nap time (home)" },
    ],
    recurring_patterns: [
      { days: ["Sat"], pattern: "Morning park + grocery run" },
      { days: ["Sun"], pattern: "Meal prep grocery shop" },
    ],
  },
  spend_history: {
    frequent_categories: ["organic_groceries", "baby_products", "health_wellness"],
    recent_merchants: ["Green Market", "Little Bloom", "Urban Pharmacy"],
    avg_transaction: "medium",
  },
  environment: { weather: "Clear and breezy", weather_code: "sunny" },
  merchants_nearby: getMerchantsForPersona("priya"),
};

export const personas = {
  maya: mayaContext,
  carlos: carlosContext,
  priya: priyaContext,
} as const;
