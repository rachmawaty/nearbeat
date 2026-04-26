import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/data/personas";
import { generateOffers } from "@/lib/ai";
import { ContextBundle, PersonaKey } from "@/lib/types";
import { ContextOverrides } from "@/components/ContextEditor";

export async function POST(req: NextRequest) {
  const { personaKey, contextOverrides } = await req.json();

  if (!personaKey || !(personaKey in personas)) {
    return NextResponse.json(
      { error: "Invalid persona key. Must be one of: maya, carlos, priya" },
      { status: 400 }
    );
  }

  const base = personas[personaKey as PersonaKey];
  const overrides = contextOverrides as ContextOverrides | undefined;
  const context: ContextBundle = overrides
    ? ({
        ...base,
        temporal: { ...base.temporal, ...overrides.temporal },
        location: { ...base.location, ...overrides.location },
        environment: { ...base.environment, ...overrides.environment },
      } as unknown as ContextBundle)
    : base;

  const result = await generateOffers(context, personaKey);
  return NextResponse.json(result);
}
