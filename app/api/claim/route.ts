import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ saved: false });
  }

  const { merchantId, merchantName, offerText, signalUsed } = await req.json();

  await prisma.claimedOffer.create({
    data: {
      userId: session.user.id,
      merchantId,
      merchantName,
      offerText,
      signalUsed,
    },
  });

  return NextResponse.json({ saved: true });
}
