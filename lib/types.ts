export interface Persona {
  name: string;
  occupation: string;
  age_bracket: "20s" | "30s" | "40s";
}

export interface Temporal {
  current_time: string;
  current_date: string;
  time_of_day_label:
    | "morning_commute"
    | "lunch"
    | "afternoon"
    | "evening"
    | "post_gym"
    | "morning"
    | "night";
}

export interface Location {
  current_area: string;
  city: string;
  neighborhood: string;
}

export interface Waypoint {
  name: string;
  eta_minutes: number;
  type: "merchant" | "transit" | "destination";
}

export interface CommonRoute {
  label: string;
  days: string[];
  passes: string[];
}

export interface Route {
  route_today: string[];
  upcoming_waypoints: Waypoint[];
  common_routes: CommonRoute[];
}

export interface ScheduleEvent {
  time: string;
  event: string;
}

export interface RecurringPattern {
  days: string[];
  pattern: string;
}

export interface Schedule {
  today: ScheduleEvent[];
  recurring_patterns: RecurringPattern[];
}

export interface SpendHistory {
  frequent_categories: string[];
  recent_merchants: string[];
  avg_transaction: "low" | "medium" | "high";
}

export interface Environment {
  weather: string;
  weather_code: "rain" | "sunny" | "cloudy" | "snow";
}

export interface MerchantOffer {
  type: "discount" | "freebie" | "upgrade" | "loyalty";
  description: string;
  value: string;
}

export interface MerchantNearby {
  id: string;
  name: string;
  category:
    | "coffee"
    | "food"
    | "health"
    | "retail"
    | "services"
    | "baby"
    | "grocery";
  distance_meters: number;
  on_route: boolean;
  available_offer: MerchantOffer;
}

export interface ContextBundle {
  persona: Persona;
  temporal: Temporal;
  location: Location;
  route: Route;
  schedule: Schedule;
  spend_history: SpendHistory;
  environment: Environment;
  merchants_nearby: MerchantNearby[];
}

export type SignalType =
  | "route"
  | "schedule"
  | "weather"
  | "spend_history"
  | "habit";

export interface Offer {
  merchant_id: string;
  merchant_name: string;
  offer: string;
  reason: string;
  signal_used: SignalType;
}

export interface OfferResponse {
  offers: Offer[];
}

export type PersonaKey = "maya" | "carlos" | "priya";

export type AIProviderType = "claude" | "openai";
