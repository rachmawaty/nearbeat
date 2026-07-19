import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { runNearbeatAgent } from "./agent.js";
import { initDb, pool } from "./db.js";
import {
  signup, login, signToken, verifyToken, updatePersona,
  getGoogleAuthUrl, exchangeGoogleCode, getGoogleUserInfo,
  findOrCreateGoogleUser, storeGoogleTokens,
  refreshGoogleAccessToken, getCalendarEvents, CLIENT_URL,
} from "./auth.js";

const app = express();
const PORT = process.env.PORT ?? 5005;

app.use(cors());
app.use(express.json());

// ── Auth middleware ──────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorised" });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Health ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", agent: "nearbeat", model: "claude-sonnet-4-6", ts: new Date().toISOString() });
});

// ── Auth routes ──────────────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, persona_key } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
  try {
    const user = await signup({ name, email, password, persona_key });
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const user = await login({ email, password });
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, persona_key, occupation, age_bracket, neighborhood, city,
            time_of_day_label, spend_categories, avg_transaction,
            location_granted, google_connected, onboarding_completed, created_at
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: "User not found" });
  res.json({ user: rows[0] });
});

app.patch("/api/auth/persona", requireAuth, async (req, res) => {
  const { persona_key } = req.body;
  if (!persona_key) return res.status(400).json({ error: "persona_key required" });
  await updatePersona(req.user.id, persona_key);
  res.json({ ok: true });
});

// ── Google Sign-in ───────────────────────────────────────────
app.get("/api/auth/google", (req, res) => {
  const redirectUri = `${CLIENT_URL}/api/auth/google/callback`;
  const url = getGoogleAuthUrl(redirectUri, ["openid", "profile", "email"]);
  res.redirect(url);
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect(`${CLIENT_URL}/auth/callback?error=cancelled`);

  try {
    const redirectUri = `${CLIENT_URL}/api/auth/google/callback`;
    const tokens = await exchangeGoogleCode(code, redirectUri);
    const userInfo = await getGoogleUserInfo(tokens.access_token);
    const user = await findOrCreateGoogleUser({
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
    });
    const jwt = signToken({ id: user.id, email: user.email });
    res.redirect(`${CLIENT_URL}/auth/callback?token=${jwt}`);
  } catch (err) {
    console.error("[google-signin] error:", err.message);
    res.redirect(`${CLIENT_URL}/auth/callback?error=failed`);
  }
});

// ── Google Connect (Calendar + Gmail) ────────────────────────
app.get("/api/auth/google/connect", (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "token required" });

  try { verifyToken(token); } catch { return res.status(401).json({ error: "Invalid token" }); }

  const redirectUri = `${CLIENT_URL}/api/auth/google/connect/callback`;
  const scopes = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
  ];
  const url = getGoogleAuthUrl(redirectUri, scopes, token);
  res.redirect(url);
});

app.get("/api/auth/google/connect/callback", async (req, res) => {
  const { code, state: token, error } = req.query;
  if (error || !code || !token) return res.redirect(`${CLIENT_URL}/?connected=0`);

  try {
    const decoded = verifyToken(token);
    const redirectUri = `${CLIENT_URL}/api/auth/google/connect/callback`;
    const tokens = await exchangeGoogleCode(code, redirectUri);
    await storeGoogleTokens(decoded.id, tokens.access_token, tokens.refresh_token ?? null);
    res.redirect(`${CLIENT_URL}/?connected=1`);
  } catch (err) {
    console.error("[google-connect] error:", err.message);
    res.redirect(`${CLIENT_URL}/?connected=0`);
  }
});

// ── Profile ──────────────────────────────────────────────────
app.post("/api/profile", requireAuth, async (req, res) => {
  const {
    occupation, age_bracket, neighborhood, city,
    time_of_day_label, spend_categories, avg_transaction,
    location_granted,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE users SET
      occupation = COALESCE($1, occupation),
      age_bracket = COALESCE($2, age_bracket),
      neighborhood = COALESCE($3, neighborhood),
      city = COALESCE($4, city),
      time_of_day_label = COALESCE($5, time_of_day_label),
      spend_categories = COALESCE($6, spend_categories),
      avg_transaction = COALESCE($7, avg_transaction),
      location_granted = COALESCE($8, location_granted),
      onboarding_completed = TRUE
     WHERE id = $9
     RETURNING id, name, email, persona_key, occupation, age_bracket, neighborhood, city,
               time_of_day_label, spend_categories, avg_transaction,
               location_granted, google_connected, onboarding_completed`,
    [occupation, age_bracket, neighborhood, city, time_of_day_label,
     spend_categories, avg_transaction, location_granted, req.user.id]
  );
  res.json(rows[0]);
});

app.get("/api/profile", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT occupation, age_bracket, neighborhood, city, time_of_day_label,
            spend_categories, avg_transaction, location_granted, google_connected, onboarding_completed
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  res.json(rows[0] ?? {});
});

// ── Google Calendar ──────────────────────────────────────────
app.get("/api/calendar", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT google_access_token, google_refresh_token, google_connected FROM users WHERE id = $1",
    [req.user.id]
  );
  const user = rows[0];
  if (!user?.google_connected) return res.status(403).json({ error: "Google not connected" });

  let accessToken = user.google_access_token;

  try {
    const events = await getCalendarEvents(accessToken);
    return res.json({ events });
  } catch (err) {
    if (err.message !== "TOKEN_EXPIRED") {
      return res.status(502).json({ error: err.message });
    }
  }

  // Token expired — refresh and retry once
  try {
    accessToken = await refreshGoogleAccessToken(req.user.id, user.google_refresh_token);
    const events = await getCalendarEvents(accessToken);
    return res.json({ events });
  } catch (err) {
    console.error("[calendar] refresh failed:", err.message);
    return res.status(502).json({ error: "Failed to fetch calendar events" });
  }
});

// ── Weather proxy ────────────────────────────────────────────
const OW_BASE = "https://api.openweathermap.org/data/2.5/weather";

function iconToEmoji(icon) {
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "🌡️";
}

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "lat and lon are required" });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenWeather API key not configured" });

  try {
    const owRes = await fetch(`${OW_BASE}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!owRes.ok) return res.status(502).json({ error: `OpenWeather error (${owRes.status})` });

    const data = await owRes.json();
    const icon = data.weather?.[0]?.icon ?? "01d";
    const description = data.weather?.[0]?.description ?? "clear sky";

    res.json({
      temp: Math.round(data.main.temp),
      label: description.charAt(0).toUpperCase() + description.slice(1),
      emoji: iconToEmoji(icon),
      city: data.name ?? "",
    });
  } catch (err) {
    console.error("[weather] error:", err.message);
    res.status(502).json({ error: "Failed to fetch weather" });
  }
});

// ── Agent route ──────────────────────────────────────────────
app.post("/api/pulse", async (req, res) => {
  const { persona, liveContext } = req.body;
  if (!persona || !persona.key) return res.status(400).json({ error: "persona context required" });

  const enrichedPersona = liveContext
    ? {
        ...persona,
        area: liveContext.city || persona.area,
        weather: { ...persona.weather, temp: liveContext.weather.temp, label: liveContext.weather.label },
        ...(liveContext.schedule?.length ? { schedule: liveContext.schedule } : {}),
        _live_signals: { lat: liveContext.lat, lon: liveContext.lon },
      }
    : persona;

  try {
    console.log(`[pulse] running agent for ${enrichedPersona.name} (${enrichedPersona.area})`);
    const result = await runNearbeatAgent(enrichedPersona);
    console.log(`[pulse] done — ${result.offers?.length} offers, ${result._steps?.length} tool calls`);
    res.json(result);
  } catch (err) {
    console.error("[pulse] agent error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Static files (production) ────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// ── Start ────────────────────────────────────────────────────
async function start() {
  if (process.env.DATABASE_URL) {
    await initDb();
  } else {
    console.warn("[db] DATABASE_URL not set — auth routes disabled");
  }
  app.listen(PORT, () => console.log(`Nearbeat agent server running on :${PORT}`));
}

start();
