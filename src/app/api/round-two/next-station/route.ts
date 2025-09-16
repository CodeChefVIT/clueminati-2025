import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import Team from "@/lib/models/team";
import { assignNextStation } from "@/utils/assignNextStation";

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(tUser.teamId);
    if (!team || !team.round2) {
      return NextResponse.json({ error: "Team not found or round2 not started" }, { status: 404 });
    }

    const result = await assignNextStation(team._id.toString());
    if ("error" in result) {
      const status = result.error.includes("not found") ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      message: "Next station",
      data: result,
    });
  } catch (err) {
    console.error("Error in nextStation route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}