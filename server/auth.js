import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "nearbeat-secret-change-in-prod";
const JWT_EXPIRES = "30d";

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
    "INSERT INTO users (name, email, password_hash, persona_key) VALUES ($1, $2, $3, $4) RETURNING id, name, email, persona_key",
    [name, email.toLowerCase(), hash, persona_key ?? "maya"]
  );
  return rows[0];
}

export async function login({ email, password }) {
  const { rows } = await pool.query(
    "SELECT id, name, email, persona_key, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  if (rows.length === 0) throw new Error("Invalid email or password");

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid email or password");

  const { password_hash, ...safe } = user;
  return safe;
}

export async function updatePersona(userId, persona_key) {
  await pool.query("UPDATE users SET persona_key = $1 WHERE id = $2", [persona_key, userId]);
}
