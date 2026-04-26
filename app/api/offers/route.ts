import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@prisma/client";
import { personas } from "@/data/personas";
import { getMerchantsForNeighborhood } from "@/data/merchants";
import { generateOffers } from "@/lib/ai";
import { ContextBundle, PersonaKey, Temporal, Waypoint, ScheduleEvent, RecurringPattern } from "@/lib/types";

function buildContextFromProfile(profile: UserProfile, userName: string): ContextBundle {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];

  return {
    persona: {
      name: userName,
      occupation: "Nearbeat user",
      age_bracket: "30s",
    },
    temporal: {
      current_time: `${profile.currentTime} ${currentDay}`,
      current_date: now.toISOString().split("T")[0],
      time_of_day_label: profile.timeOfDayLabel as Temporal["time_of_day_label"],

    },
    location: {
      current_area: profile.currentArea,
      city: profile.city,
      neighborhood: profile.neighborhood,
    },
    route: {
      route_today: (Array.isArray(profile.routeToday) ? profile.routeToday : []) as string[],
      upcoming_waypoints: (Array.isArray(profile.upcomingWaypoints) ? profile.upcomingWaypoints : []) as unknown as Waypoint[],
      common_routes: [],
    },
    schedule: {
      today: (Array.isArray(profile.todaySchedule) ? profile.todaySchedule : []) as unknown as ScheduleEvent[],
      recurring_patterns: (Array.isArray(profile.recurringPatterns) ? profile.recurringPatterns : []) as unknown as RecurringPattern[],
    },
    spend_history: {
      frequent_categories: profile.spendCategories ?? [],
      recent_merchants: profile.recentMerchants ?? [],
      avg_transaction: profile.avgTransaction as "low" | "medium" | "high",
    },
    environment: {
      weather: profile.weather,
      weather_code: profile.weatherCode as "rain" | "sunny" | "cloudy" | "snow",
    },
    merchants_nearby: getMerchantsForNeighborhood(profile.neighborhood),
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { personaKey, contextOverrides } = await req.json();

  // Authenticated path — use real user profile
  if (session?.user?.id) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile?.onboardingCompleted) {
      const base = buildContextFromProfile(profile, session.user.name ?? "You");
      const context: ContextBundle = contextOverrides
        ? {
            ...base,
            temporal: { ...base.temporal, ...contextOverrides.temporal },
            environment: { ...base.environment, ...contextOverrides.environment },
          }
        : base;
      const result = await generateOffers(context, "user");
      return NextResponse.json(result);
    }
  }

  // Demo path — use hardcoded personas
  if (!personaKey || !(personaKey in personas)) {
    return NextResponse.json(
      { error: "Invalid persona key. Must be one of: maya, carlos, priya" },
      { status: 400 }
    );
  }

  const base = personas[personaKey as PersonaKey];
  const context: ContextBundle = contextOverrides
    ? {
        ...base,
        temporal: { ...base.temporal, ...contextOverrides.temporal },
        location: { ...base.location, ...contextOverrides.location },
        environment: { ...base.environment, ...contextOverrides.environment },
      }
    : base;

  const result = await generateOffers(context, personaKey);
  return NextResponse.json(result);
}
