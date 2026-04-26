import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/data/personas";
import { generateOffers } from "@/lib/ai";
import { ContextBundle, PersonaKey } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { personaKey, contextOverrides } = await req.json();

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
