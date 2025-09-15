import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import User from "@/lib/models/user";
import Team from "@/lib/models/team";
import Station from "@/lib/models/station";
import { giveQuestionRoundTwo } from "@/utils/giveQuestionRoundTwo";

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "participant") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const stationId = searchParams.get("stationId");
    const difficulty = searchParams.get("difficulty") as
      | "easy"
      | "medium"
      | "hard"
      | null;

    if (!teamId || !stationId || !difficulty) {
      return NextResponse.json(
        { error: "teamId, stationId, and difficulty are required" },
        { status: 400 }
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const station = await Station.findById(stationId);
    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    const result = await giveQuestionRoundTwo(teamId, difficulty);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "successfully fetched question", data: result.question },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/round-two/serve-question:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}