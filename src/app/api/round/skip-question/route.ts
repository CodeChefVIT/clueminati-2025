import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Team from "@/lib/models/team";
import { getCurrentRound } from "@/utils/getRound";

// testing skip - Skip question API endpoint
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const teamId = decoded.teamId;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team membership required" },
        { status: 403 }
      );
    }

    // Get current round
    const currentRound = await getCurrentRound();
    if (!currentRound || (currentRound !== "1" && currentRound !== "2")) {
      return NextResponse.json(
        { error: "No active round" },
        { status: 400 }
      );
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check skip cooldown based on current round
    const roundKey = currentRound === "1" ? "round1" : "round2";
    const roundData = team[roundKey];
    
    if (roundData?.lastSkipTimestamp) {
      const lastSkip = new Date(roundData.lastSkipTimestamp);
      const now = new Date();
      const timeDiff = now.getTime() - lastSkip.getTime();
      const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeDiff < fiveMinutesInMs) {
        const remainingTime = fiveMinutesInMs - timeDiff;
        const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
        
        return NextResponse.json(
          { 
            error: "Skip cooldown active",
            remainingTime: remainingTime,
            remainingMinutes: remainingMinutes
          },
          { status: 429 }
        );
      }
    }

    // Update skip timestamp
    const updateQuery = {
      [`${roundKey}.lastSkipTimestamp`]: new Date()
    };

    await Team.findByIdAndUpdate(teamId, updateQuery);

    return NextResponse.json({
      success: true,
      message: "Question skipped successfully",
      cooldownUntil: new Date(Date.now() + 5 * 60 * 1000)
    });

  } catch (error) {
    console.error("Skip question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// testing skip - Get skip status API endpoint
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const teamId = decoded.teamId;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team membership required" },
        { status: 403 }
      );
    }

    // Get current round
    const currentRound = await getCurrentRound();
    if (!currentRound || (currentRound !== "1" && currentRound !== "2")) {
      return NextResponse.json({
        canSkip: false,
        reason: "No active round"
      });
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check skip cooldown based on current round
    const roundKey = currentRound === "1" ? "round1" : "round2";
    const roundData = team[roundKey];
    
    if (roundData?.lastSkipTimestamp) {
      const lastSkip = new Date(roundData.lastSkipTimestamp);
      const now = new Date();
      const timeDiff = now.getTime() - lastSkip.getTime();
      const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeDiff < fiveMinutesInMs) {
        const remainingTime = fiveMinutesInMs - timeDiff;
        
        return NextResponse.json({
          canSkip: false,
          remainingTime: remainingTime,
          remainingSeconds: Math.ceil(remainingTime / 1000),
          lastSkipTimestamp: lastSkip
        });
      }
    }

    return NextResponse.json({
      canSkip: true,
      remainingTime: 0,
      remainingSeconds: 0
    });

  } catch (error) {
    console.error("Get skip status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}