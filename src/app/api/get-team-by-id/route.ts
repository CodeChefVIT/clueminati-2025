import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();
export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const team = await Team.findById(teamId).select('teamname total_score');
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "team successfully found", data: {
        teamname: team.teamname,
        total_score: team.total_score
      } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/get-team:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
