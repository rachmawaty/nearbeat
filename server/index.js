import "dotenv/config";
import express from "express";
import cors from "cors";
import { runNearbeatAgent } from "./agent.js";
import { initDb } from "./db.js";
import { signup, login, signToken, verifyToken, updatePersona } from "./auth.js";

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
  const { rows } = await (await import("./db.js")).pool.query(
    "SELECT id, name, email, persona_key, created_at FROM users WHERE id = $1",
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

// ── Agent route ──────────────────────────────────────────────
app.post("/api/pulse", async (req, res) => {
  const { persona } = req.body;
  if (!persona || !persona.key) return res.status(400).json({ error: "persona context required" });
  try {
    console.log(`[pulse] running agent for ${persona.name} (${persona.city})`);
    const result = await runNearbeatAgent(persona);
    console.log(`[pulse] done — ${result.offers?.length} offers, ${result._steps?.length} tool calls`);
    res.json(result);
  } catch (err) {
    console.error("[pulse] agent error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

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
