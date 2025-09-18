import { NextRequest, NextResponse } from "next/server";
import { getCurrentRound } from "@/utils/getRound";

export async function GET(req: NextRequest) {
  try {
    const currentRound = await getCurrentRound();
    const now = new Date();
    
    return NextResponse.json({
      currentRound,
      currentTime: now.toISOString(),
      timestamp: now.getTime()
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get round" }, { status: 500 });
  }
}