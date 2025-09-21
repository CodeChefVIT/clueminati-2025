import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import Team from "@/lib/models/team";
import User from "@/lib/models/user";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "core_member") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { teamId } = body;

    if (!teamId) {
      return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    const team = await Team.findById(teamId).lean();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Return team info with Round 2 data for core member scanning
    return NextResponse.json({
      success: true,
      team: {
        _id: team._id,
        teamname: team.teamname,
        total_score: team.total_score,
        members: team.members,
        round2: team.round2 ? {
          currentStation: team.round2.currentStation,
          previousStation: team.round2.previousStation,
          solvedStations: team.round2.solvedStations,
          score: team.round2.score,
          secret_chars_revealed: team.round2.secret_chars_revealed,
          letters_found: team.round2.letters_found
        } : null
      }
    }, { status: 200 });

  } catch (err) {
    console.error("Error in scan-team:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}