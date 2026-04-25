import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/data/personas";
import { generateOffers } from "@/lib/ai";
import { PersonaKey } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { personaKey } = await req.json();

  if (!personaKey || !(personaKey in personas)) {
    return NextResponse.json(
      { error: "Invalid persona key. Must be one of: maya, carlos, priya" },
      { status: 400 }
    );
  }

  const context = personas[personaKey as PersonaKey];
  const result = await generateOffers(context, personaKey);

  return NextResponse.json(result);
}
