import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "nearbeat-secret-change-in-prod";
const JWT_EXPIRES = "30d";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:8080";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function signup({ name, email, password, persona_key }) {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows.length > 0) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password_hash, persona_key) VALUES ($1, $2, $3, $4) RETURNING id, name, email, persona_key, onboarding_completed",
    [name, email.toLowerCase(), hash, persona_key ?? "maya"]
  );
  return rows[0];
}

export async function login({ email, password }) {
  const { rows } = await pool.query(
    "SELECT id, name, email, persona_key, password_hash, onboarding_completed FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  if (rows.length === 0) throw new Error("Invalid email or password");

  const user = rows[0];
  if (!user.password_hash) throw new Error("This account uses Google sign-in");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid email or password");

  const { password_hash, ...safe } = user;
  return safe;
}

export async function updatePersona(userId, persona_key) {
  await pool.query("UPDATE users SET persona_key = $1 WHERE id = $2", [persona_key, userId]);
}

// ── Google OAuth ─────────────────────────────────────────────

export function getGoogleAuthUrl(redirectUri, scopes, state = "") {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code, redirectUri) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Failed to exchange Google code");
  return res.json();
}

export async function getGoogleUserInfo(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to get Google user info");
  return res.json();
}

export async function findOrCreateGoogleUser({ googleId, email, name }) {
  const { rows: existing } = await pool.query(
    "SELECT id, name, email, persona_key, onboarding_completed FROM users WHERE google_id = $1 OR email = $2",
    [googleId, email.toLowerCase()]
  );

  if (existing.length > 0) {
    const user = existing[0];
    await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [googleId, user.id]);
    return user;
  }

  const { rows } = await pool.query(
    "INSERT INTO users (name, email, google_id, persona_key) VALUES ($1, $2, $3, 'maya') RETURNING id, name, email, persona_key, onboarding_completed",
    [name, email.toLowerCase(), googleId]
  );
  return rows[0];
}

export async function storeGoogleTokens(userId, accessToken, refreshToken) {
  await pool.query(
    "UPDATE users SET google_connected = TRUE, google_access_token = $1, google_refresh_token = $2 WHERE id = $3",
    [accessToken, refreshToken, userId]
  );
}

export async function refreshGoogleAccessToken(userId, refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh Google access token");
  const data = await res.json();
  await pool.query(
    "UPDATE users SET google_access_token = $1 WHERE id = $2",
    [data.access_token, userId]
  );
  return data.access_token;
}

export async function getCalendarEvents(accessToken) {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: endOfDay.toISOString(),
    maxResults: "5",
    singleEvents: "true",
    orderBy: "startTime",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) throw new Error(`Calendar API error (${res.status})`);

  const data = await res.json();
  return (data.items ?? []).map((event) => {
    const dt = event.start?.dateTime ?? event.start?.date ?? "";
    const time = dt.includes("T")
      ? new Date(dt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "All day";
    return {
      time,
      event: event.summary ?? "Untitled",
      ...(event.location ? { location: event.location } : {}),
    };
  });
}

export { CLIENT_URL };
