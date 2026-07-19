import { NextRequest, NextResponse } from "next/server";

const OW_BASE = "https://api.openweathermap.org/data/2.5/weather";

function iconToEmoji(icon: string): string {
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "🌡️";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    `${OW_BASE}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `OpenWeather error (${res.status})` }, { status: 502 });
  }

  const data = await res.json();
  const icon: string = data.weather?.[0]?.icon ?? "01d";
  const description: string = data.weather?.[0]?.description ?? "clear sky";

  return NextResponse.json({
    temp: Math.round(data.main.temp),
    label: description.charAt(0).toUpperCase() + description.slice(1),
    emoji: iconToEmoji(icon),
    city: data.name ?? "",
  });
}
