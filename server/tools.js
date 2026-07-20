import { pool } from "./db.js";

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

/**
 * get_merchants_nearby
 * Queries the merchants table filtered by city and optional area/categories.
 */
export async function get_merchants_nearby({ city, area, categories }) {
  try {
    let query = "SELECT * FROM merchants WHERE LOWER(city) = LOWER($1)";
    const params = [city];

    if (area) {
      params.push(area);
      query += ` AND LOWER(area) = LOWER($${params.length})`;
    }

    query += " ORDER BY distance_m ASC LIMIT 12";
    const { rows } = await pool.query(query, params);

    const merchants = categories?.length
      ? rows.filter((m) => categories.some((c) => m.category.toLowerCase().includes(c.toLowerCase())))
      : rows;

    return { merchants: merchants.slice(0, 8), city, area: area ?? null, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error("[get_merchants_nearby] DB error:", err.message);
    return { merchants: [], city, error: err.message, timestamp: new Date().toISOString() };
  }
}

/**
 * get_live_weather
 * Returns current weather for the user's city.
 * In production: calls OpenWeather API with real coordinates.
 */
export function get_live_weather({ city }) {
  const conditions = {
    Cambridge: { condition: "Light rain incoming", temp_c: 14, emoji: "🌦️", code: "rain", advisory: "Bring an umbrella — precipitation in 20 min" },
    Lawrence:  { condition: "Partly cloudy",       temp_c: 18, emoji: "⛅",  code: "cloudy", advisory: "Comfortable outdoors" },
    Jakarta:   { condition: "Hot and humid",        temp_c: 32, emoji: "🌤️", code: "sunny", advisory: "Stay hydrated" },
  };
  return conditions[city] ?? { condition: "Clear", temp_c: 20, emoji: "☀️", code: "sunny", advisory: "Nice day" };
}

/**
 * score_signal_relevance
 * Given a signal type and the user's context, returns a relevance score 0-1
 * and an explanation of why the signal is active.
 */
export function score_signal_relevance({ signal, context }) {
  const now = new Date();
  const hour = now.getHours();
  const scores = {
    route:    { score: context.next_waypoint ? 0.9 : 0.3, reason: context.next_waypoint ? `En route to ${context.next_waypoint.name} (${context.next_waypoint.eta} min)` : "Stationary" },
    schedule: { score: context.schedule?.length > 0 ? 0.85 : 0.2, reason: context.schedule?.[0] ? `Next: ${context.schedule[0].event} at ${context.schedule[0].time}` : "No upcoming events" },
    habit:    { score: 0.8, reason: `Frequent merchants: ${context.spend?.merchants?.slice(0, 2).join(", ")}` },
    weather:  { score: context.weather?.code === "rain" ? 0.95 : 0.4, reason: context.weather?.label ?? "Weather checked" },
    spend:    { score: 0.75, reason: `Top spend: ${context.spend?.categories?.slice(0, 2).join(", ")}` },
    health:   { score: context.health?.gym_today ? 0.9 : 0.3, reason: context.health?.gym_today ? "Gym session detected today" : "Rest day" },
    email:    { score: context.email_bookings?.length > 0 ? 0.88 : 0.2, reason: context.email_bookings?.[0] ? `Booking: ${context.email_bookings[0].merchant} at ${context.email_bookings[0].time}` : "No upcoming bookings" },
  };
  return scores[signal] ?? { score: 0.5, reason: "Signal active" };
}
