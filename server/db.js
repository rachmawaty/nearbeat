import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                    SERIAL PRIMARY KEY,
      email                 TEXT UNIQUE NOT NULL,
      name                  TEXT NOT NULL,
      password_hash         TEXT,
      google_id             TEXT UNIQUE,
      persona_key           TEXT NOT NULL DEFAULT 'maya',
      occupation            TEXT,
      age_bracket           TEXT,
      neighborhood          TEXT,
      city                  TEXT DEFAULT 'Boston',
      time_of_day_label     TEXT DEFAULT 'morning_commute',
      spend_categories      TEXT[] DEFAULT '{}',
      avg_transaction       TEXT DEFAULT 'medium',
      location_granted      BOOLEAN DEFAULT FALSE,
      google_connected      BOOLEAN DEFAULT FALSE,
      google_access_token   TEXT,
      google_refresh_token  TEXT,
      onboarding_completed  BOOLEAN DEFAULT FALSE,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Migrations for existing tables
  const migrations = [
    "ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS age_bracket TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS neighborhood TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Boston'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS time_of_day_label TEXT DEFAULT 'morning_commute'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS spend_categories TEXT[] DEFAULT '{}'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS avg_transaction TEXT DEFAULT 'medium'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS location_granted BOOLEAN DEFAULT FALSE",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_connected BOOLEAN DEFAULT FALSE",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_access_token TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE",
  ];

  for (const sql of migrations) {
    try { await pool.query(sql); } catch { /* column already exists or constraint already dropped */ }
  }

  console.log("[db] schema ready");
}
