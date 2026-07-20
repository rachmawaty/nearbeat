import "dotenv/config";
import { pool, initDb } from "./db.js";

const MERCHANTS = [
  // ── Cambridge — Kendall Square ───────────────────────────────
  { id: "tatte-kendall",    name: "Tatte Bakery & Cafe",   emoji: "🥐", category: "coffee",    address: "318 Third St, Cambridge, MA",                area: "Kendall Square", city: "Cambridge", distance_m: 210, eta_min: 4,  avg_spend: 12,   currency: "USD" },
  { id: "area-four",        name: "Area Four",              emoji: "🍕", category: "dining",    address: "500 Technology Square, Cambridge, MA",        area: "Kendall Square", city: "Cambridge", distance_m: 380, eta_min: 7,  avg_spend: 22,   currency: "USD" },
  { id: "cava-kendall",     name: "Cava",                   emoji: "🥗", category: "dining",    address: "300 Broad Canal Way, Cambridge, MA",          area: "Kendall Square", city: "Cambridge", distance_m: 290, eta_min: 5,  avg_spend: 15,   currency: "USD" },
  { id: "clover-kendall",   name: "Clover Food Lab",        emoji: "🌿", category: "dining",    address: "5 Cambridge Center, Cambridge, MA",           area: "Kendall Square", city: "Cambridge", distance_m: 160, eta_min: 3,  avg_spend: 13,   currency: "USD" },
  { id: "cvs-kendall",      name: "CVS Pharmacy",           emoji: "💊", category: "health",    address: "250 Main St, Cambridge, MA",                  area: "Kendall Square", city: "Cambridge", distance_m: 340, eta_min: 6,  avg_spend: 18,   currency: "USD" },
  { id: "equinox-kendall",  name: "Equinox Kendall Square", emoji: "🏋️", category: "wellness",  address: "145 Broadway, Cambridge, MA",                 area: "Kendall Square", city: "Cambridge", distance_m: 420, eta_min: 8,  avg_spend: 35,   currency: "USD" },

  // ── Cambridge — Harvard Square ───────────────────────────────
  { id: "tatte-harvard",         name: "Tatte Bakery & Cafe",  emoji: "🥐", category: "coffee",    address: "1288 Massachusetts Ave, Cambridge, MA",     area: "Harvard Square", city: "Cambridge", distance_m: 180, eta_min: 3,  avg_spend: 12,   currency: "USD" },
  { id: "flour-bakery-harvard",  name: "Flour Bakery + Cafe",  emoji: "☕", category: "coffee",    address: "1595 Washington St, Cambridge, MA",          area: "Harvard Square", city: "Cambridge", distance_m: 310, eta_min: 6,  avg_spend: 11,   currency: "USD" },
  { id: "harvest-restaurant",    name: "Harvest",              emoji: "🍽️", category: "dining",    address: "44 Brattle St, Cambridge, MA",               area: "Harvard Square", city: "Cambridge", distance_m: 250, eta_min: 5,  avg_spend: 55,   currency: "USD" },
  { id: "harvard-book-store",    name: "Harvard Book Store",   emoji: "📚", category: "retail",    address: "1256 Massachusetts Ave, Cambridge, MA",      area: "Harvard Square", city: "Cambridge", distance_m: 200, eta_min: 4,  avg_spend: 22,   currency: "USD" },
  { id: "trader-joes-harvard",   name: "Trader Joe's",         emoji: "🛒", category: "groceries", address: "748 Memorial Dr, Cambridge, MA",             area: "Harvard Square", city: "Cambridge", distance_m: 480, eta_min: 9,  avg_spend: 45,   currency: "USD" },
  { id: "jp-licks-harvard",      name: "JP Licks",             emoji: "🍦", category: "dining",    address: "1312 Massachusetts Ave, Cambridge, MA",      area: "Harvard Square", city: "Cambridge", distance_m: 220, eta_min: 4,  avg_spend: 7,    currency: "USD" },
  { id: "darwins-ltd",           name: "Darwin's Ltd",         emoji: "🥪", category: "coffee",    address: "148 Mount Auburn St, Cambridge, MA",         area: "Harvard Square", city: "Cambridge", distance_m: 360, eta_min: 7,  avg_spend: 14,   currency: "USD" },

  // ── Cambridge — Central Square ───────────────────────────────
  { id: "central-kitchen",       name: "Central Kitchen",        emoji: "🍷", category: "dining",    address: "567 Massachusetts Ave, Cambridge, MA",      area: "Central Square", city: "Cambridge", distance_m: 270, eta_min: 5,  avg_spend: 38,   currency: "USD" },
  { id: "1369-coffee-central",   name: "1369 Coffee House",      emoji: "☕", category: "coffee",    address: "757 Massachusetts Ave, Cambridge, MA",      area: "Central Square", city: "Cambridge", distance_m: 190, eta_min: 4,  avg_spend: 9,    currency: "USD" },
  { id: "middle-east-cambridge", name: "The Middle East",        emoji: "🎵", category: "dining",    address: "472 Massachusetts Ave, Cambridge, MA",      area: "Central Square", city: "Cambridge", distance_m: 310, eta_min: 6,  avg_spend: 20,   currency: "USD" },
  { id: "whole-foods-central",   name: "Whole Foods Market",     emoji: "🥦", category: "groceries", address: "340 River St, Cambridge, MA",               area: "Central Square", city: "Cambridge", distance_m: 550, eta_min: 10, avg_spend: 52,   currency: "USD" },
  { id: "cvs-central",           name: "CVS Pharmacy",           emoji: "💊", category: "health",    address: "625 Massachusetts Ave, Cambridge, MA",      area: "Central Square", city: "Cambridge", distance_m: 240, eta_min: 5,  avg_spend: 16,   currency: "USD" },
  { id: "cambridge-yoga",        name: "Cambridge Yoga",         emoji: "🧘", category: "wellness",  address: "590 Massachusetts Ave, Cambridge, MA",      area: "Central Square", city: "Cambridge", distance_m: 280, eta_min: 5,  avg_spend: 28,   currency: "USD" },

  // ── Cambridge — Inman Square ─────────────────────────────────
  { id: "1369-coffee-inman",     name: "1369 Coffee House",        emoji: "☕", category: "coffee",    address: "1369 Cambridge St, Cambridge, MA",         area: "Inman Square", city: "Cambridge", distance_m: 150, eta_min: 3,  avg_spend: 8,    currency: "USD" },
  { id: "bukowski-tavern",       name: "Bukowski Tavern",          emoji: "🍺", category: "dining",    address: "1281 Cambridge St, Cambridge, MA",         area: "Inman Square", city: "Cambridge", distance_m: 320, eta_min: 6,  avg_spend: 18,   currency: "USD" },
  { id: "oleana",                name: "Oleana",                   emoji: "🍽️", category: "dining",    address: "134 Hampshire St, Cambridge, MA",          area: "Inman Square", city: "Cambridge", distance_m: 290, eta_min: 5,  avg_spend: 55,   currency: "USD" },
  { id: "punjabi-dhaba",         name: "Punjabi Dhaba",            emoji: "🍛", category: "dining",    address: "225 Hampshire St, Cambridge, MA",          area: "Inman Square", city: "Cambridge", distance_m: 200, eta_min: 4,  avg_spend: 14,   currency: "USD" },
  { id: "inman-pharmacy",        name: "Inman Pharmacy",           emoji: "💊", category: "health",    address: "1414 Cambridge St, Cambridge, MA",         area: "Inman Square", city: "Cambridge", distance_m: 170, eta_min: 3,  avg_spend: 20,   currency: "USD" },
  { id: "cambridge-naturals",    name: "Cambridge Naturals",       emoji: "🌱", category: "wellness",  address: "23 White St, Cambridge, MA",               area: "Inman Square", city: "Cambridge", distance_m: 380, eta_min: 7,  avg_spend: 25,   currency: "USD" },

  // ── Lawrence, MA ─────────────────────────────────────────────
  { id: "el-taller-del-sabor",   name: "El Taller del Sabor",     emoji: "🍽️", category: "dining",    address: "350 Essex St, Lawrence MA",                area: "Downtown Lawrence", city: "Lawrence", distance_m: 300,  eta_min: 5,  avg_spend: 14,  currency: "USD" },
  { id: "la-brasa",              name: "La Brasa Restaurant",     emoji: "🍗", category: "dining",    address: "72 Common St, Lawrence MA",                area: "Common St Corridor", city: "Lawrence", distance_m: 450,  eta_min: 8,  avg_spend: 16,  currency: "USD" },
  { id: "el-rincon-dominicano",  name: "El Rincón Dominicano",    emoji: "🥘", category: "dining",    address: "191 Broadway, Lawrence MA",                area: "Broadway",           city: "Lawrence", distance_m: 600,  eta_min: 10, avg_spend: 13,  currency: "USD" },
  { id: "antojitos-salvadorenos",name: "Antojitos Salvadoreños",  emoji: "🫔", category: "dining",    address: "42 Haverhill St, Lawrence MA",             area: "South Lawrence",     city: "Lawrence", distance_m: 750,  eta_min: 12, avg_spend: 11,  currency: "USD" },
  { id: "cafe-azteca",           name: "Café Azteca",             emoji: "☕", category: "coffee",    address: "95 Common St, Lawrence MA",                area: "Common St Corridor", city: "Lawrence", distance_m: 400,  eta_min: 7,  avg_spend: 8,   currency: "USD" },
  { id: "panaderia-la-reina",    name: "Panadería La Reina",      emoji: "🥐", category: "coffee",    address: "220 Essex St, Lawrence MA",                area: "Downtown Lawrence",  city: "Lawrence", distance_m: 350,  eta_min: 6,  avg_spend: 7,   currency: "USD" },
  { id: "compare-foods",         name: "Compare Foods",           emoji: "🛒", category: "groceries", address: "460 Winthrop Ave, Lawrence MA",             area: "South Lawrence",     city: "Lawrence", distance_m: 1100, eta_min: 18, avg_spend: 55,  currency: "USD" },
  { id: "market-basket-lawrence",name: "Market Basket",           emoji: "🏪", category: "groceries", address: "700 Essex St, Lawrence MA",                area: "South Lawrence",     city: "Lawrence", distance_m: 1400, eta_min: 22, avg_spend: 65,  currency: "USD" },
  { id: "cvs-essex",             name: "CVS Pharmacy",            emoji: "💊", category: "health",    address: "300 Essex St, Lawrence MA",                area: "Downtown Lawrence",  city: "Lawrence", distance_m: 280,  eta_min: 5,  avg_spend: 22,  currency: "USD" },
  { id: "walgreens-broadway",    name: "Walgreens",               emoji: "💊", category: "health",    address: "400 Broadway, Lawrence MA",                area: "Broadway",           city: "Lawrence", distance_m: 900,  eta_min: 15, avg_spend: 20,  currency: "USD" },
  { id: "botanica-santa-barbara",name: "Botánica Santa Bárbara",  emoji: "🌿", category: "wellness",  address: "130 Common St, Lawrence MA",               area: "Common St Corridor", city: "Lawrence", distance_m: 500,  eta_min: 9,  avg_spend: 18,  currency: "USD" },
  { id: "moda-style-boutique",   name: "Moda & Style Boutique",   emoji: "👗", category: "retail",    address: "170 Essex St, Lawrence MA",                area: "Downtown Lawrence",  city: "Lawrence", distance_m: 320,  eta_min: 6,  avg_spend: 30,  currency: "USD" },
  { id: "tienda-tropical",       name: "Tienda Tropical",         emoji: "🛍️", category: "retail",    address: "88 Lawrence St, Lawrence MA",              area: "South Lawrence",     city: "Lawrence", distance_m: 680,  eta_min: 11, avg_spend: 25,  currency: "USD" },
  { id: "salon-latino-beauty",   name: "Salón Latino Beauty",     emoji: "💈", category: "wellness",  address: "215 Broadway, Lawrence MA",                area: "Broadway",           city: "Lawrence", distance_m: 720,  eta_min: 12, avg_spend: 28,  currency: "USD" },

  // ── Jakarta — SCBD ───────────────────────────────────────────
  { id: "starbucks-pacific-place",   name: "Starbucks",              emoji: "☕", category: "coffee",    address: "Pacific Place Mall, Jl. Jend. Sudirman Kav. 52-53",  area: "SCBD", city: "Jakarta", distance_m: 200, eta_min: 4,  avg_spend: 60000,  currency: "IDR" },
  { id: "kopi-kenangan-scbd",        name: "Kopi Kenangan",          emoji: "☕", category: "coffee",    address: "Pacific Place Mall, Jl. Jend. Sudirman Kav. 52-53",  area: "SCBD", city: "Jakarta", distance_m: 250, eta_min: 5,  avg_spend: 35000,  currency: "IDR" },
  { id: "saturdays-scbd",            name: "Saturdays Coffee",       emoji: "☕", category: "coffee",    address: "Sequis Tower, Jl. Jend. Sudirman Kav. 71",           area: "SCBD", city: "Jakarta", distance_m: 380, eta_min: 7,  avg_spend: 55000,  currency: "IDR" },
  { id: "excelso-sudirman",          name: "Excelso Café",           emoji: "☕", category: "coffee",    address: "Menara Sudirman, Jl. Jend. Sudirman Kav. 60",        area: "SCBD", city: "Jakarta", distance_m: 400, eta_min: 8,  avg_spend: 45000,  currency: "IDR" },
  { id: "union-scbd",                name: "Union",                  emoji: "🍽️", category: "dining",    address: "Pacific Place Mall Lt. 5, Jl. Jend. Sudirman",        area: "SCBD", city: "Jakarta", distance_m: 300, eta_min: 6,  avg_spend: 150000, currency: "IDR" },
  { id: "sushi-tei-pacific-place",   name: "Sushi Tei",              emoji: "🍣", category: "dining",    address: "Pacific Place Mall, Jl. Jend. Sudirman Kav. 52-53",  area: "SCBD", city: "Jakarta", distance_m: 320, eta_min: 6,  avg_spend: 130000, currency: "IDR" },
  { id: "skye-bar",                  name: "SKYE Bar & Restaurant",  emoji: "🌆", category: "dining",    address: "BCA Tower Lt. 56, Jl. MH Thamrin No. 1",             area: "SCBD", city: "Jakarta", distance_m: 500, eta_min: 10, avg_spend: 250000, currency: "IDR" },
  { id: "popolamama-scbd",           name: "Popo La Mama",           emoji: "🍝", category: "dining",    address: "Jl. Jend. Sudirman, SCBD",                           area: "SCBD", city: "Jakarta", distance_m: 450, eta_min: 9,  avg_spend: 100000, currency: "IDR" },
  { id: "fitness-first-pacific",     name: "Fitness First",          emoji: "🏋️", category: "wellness",  address: "Pacific Place Mall Lt. 6, Jl. Jend. Sudirman",        area: "SCBD", city: "Jakarta", distance_m: 280, eta_min: 5,  avg_spend: 150000, currency: "IDR" },
  { id: "guardian-pacific-place",    name: "Guardian",               emoji: "💊", category: "health",    address: "Pacific Place Mall, Jl. Jend. Sudirman Kav. 52-53",  area: "SCBD", city: "Jakarta", distance_m: 220, eta_min: 4,  avg_spend: 80000,  currency: "IDR" },
  { id: "ranch-market-scbd",         name: "Ranch Market",           emoji: "🛒", category: "groceries", address: "Pacific Place Mall B1, Jl. Jend. Sudirman",           area: "SCBD", city: "Jakarta", distance_m: 260, eta_min: 5,  avg_spend: 200000, currency: "IDR" },
  { id: "indomaret-scbd",            name: "Indomaret",              emoji: "🏪", category: "groceries", address: "Jl. Jend. Sudirman Kav. 54, SCBD",                   area: "SCBD", city: "Jakarta", distance_m: 150, eta_min: 3,  avg_spend: 25000,  currency: "IDR" },

  // ── Jakarta — Tebet ──────────────────────────────────────────
  { id: "toko-kopi-tuku-tebet",      name: "Toko Kopi Tuku",             emoji: "☕", category: "coffee",    address: "Jl. Prof. Supomo No. 1, Tebet",                area: "Tebet", city: "Jakarta", distance_m: 180, eta_min: 4,  avg_spend: 30000,  currency: "IDR" },
  { id: "titik-temu-tebet",          name: "Titik Temu Coffee",          emoji: "☕", category: "coffee",    address: "Jl. Tebet Raya No. 57, Tebet",                 area: "Tebet", city: "Jakarta", distance_m: 220, eta_min: 4,  avg_spend: 38000,  currency: "IDR" },
  { id: "jiwa-toast-tebet",          name: "Jiwa Toast",                 emoji: "🍞", category: "coffee",    address: "Jl. Tebet Barat Raya No. 33, Tebet",           area: "Tebet", city: "Jakarta", distance_m: 270, eta_min: 5,  avg_spend: 32000,  currency: "IDR" },
  { id: "clique-coffee-tebet",       name: "Clique Coffee & Kitchen",    emoji: "☕", category: "coffee",    address: "Jl. Tebet Barat Dalam VII No. 3, Tebet",       area: "Tebet", city: "Jakarta", distance_m: 310, eta_min: 6,  avg_spend: 50000,  currency: "IDR" },
  { id: "kedai-kita-tebet",          name: "Kedai Kita",                 emoji: "🍛", category: "dining",    address: "Jl. Tebet Barat Dalam No. 14, Tebet",          area: "Tebet", city: "Jakarta", distance_m: 300, eta_min: 6,  avg_spend: 55000,  currency: "IDR" },
  { id: "warung-pak-ndut-tebet",     name: "Warung Pak Ndut",            emoji: "🍜", category: "dining",    address: "Jl. Tebet Timur Dalam Raya, Tebet",            area: "Tebet", city: "Jakarta", distance_m: 350, eta_min: 7,  avg_spend: 40000,  currency: "IDR" },
  { id: "nasi-goreng-kambing-tebet", name: "Nasi Goreng Kambing",        emoji: "🍳", category: "dining",    address: "Jl. Tebet Timur Raya No. 8, Tebet",            area: "Tebet", city: "Jakarta", distance_m: 450, eta_min: 9,  avg_spend: 50000,  currency: "IDR" },
  { id: "mie-gacoan-tebet",          name: "Mie Gacoan",                 emoji: "🍜", category: "dining",    address: "Jl. Dr. Supomo SH, Tebet",                     area: "Tebet", city: "Jakarta", distance_m: 380, eta_min: 7,  avg_spend: 45000,  currency: "IDR" },
  { id: "gold-gym-tebet",            name: "Gold's Gym",                 emoji: "🏋️", category: "wellness",  address: "Tebet Mas Indah, Jl. Dr. Supomo SH No. 1",     area: "Tebet", city: "Jakarta", distance_m: 400, eta_min: 8,  avg_spend: 120000, currency: "IDR" },
  { id: "kimia-farma-tebet",         name: "Kimia Farma Apotek",         emoji: "💊", category: "health",    address: "Jl. Tebet Raya No. 2, Tebet",                  area: "Tebet", city: "Jakarta", distance_m: 200, eta_min: 4,  avg_spend: 60000,  currency: "IDR" },
  { id: "alfamart-tebet",            name: "Alfamart",                   emoji: "🏪", category: "groceries", address: "Jl. Prof. Supomo No. 12, Tebet",               area: "Tebet", city: "Jakarta", distance_m: 120, eta_min: 2,  avg_spend: 20000,  currency: "IDR" },
];

async function seed() {
  await initDb();

  let inserted = 0;
  let skipped = 0;

  for (const m of MERCHANTS) {
    const res = await pool.query(
      `INSERT INTO merchants (id, name, emoji, category, address, area, city, distance_m, eta_min, avg_spend, currency)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, emoji=EXCLUDED.emoji, category=EXCLUDED.category,
         address=EXCLUDED.address, area=EXCLUDED.area, city=EXCLUDED.city,
         distance_m=EXCLUDED.distance_m, eta_min=EXCLUDED.eta_min,
         avg_spend=EXCLUDED.avg_spend, currency=EXCLUDED.currency`,
      [m.id, m.name, m.emoji, m.category, m.address, m.area, m.city,
       m.distance_m, m.eta_min, m.avg_spend, m.currency]
    );
    if (res.rowCount > 0) inserted++;
    else skipped++;
  }

  console.log(`[seed] done — ${inserted} upserted, ${skipped} unchanged`);
  await pool.end();
}

seed().catch(err => { console.error("[seed] error:", err.message); process.exit(1); });
