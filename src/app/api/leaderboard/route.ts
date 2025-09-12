// src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";

export async function GET() {
  try {
   
    await connectToDatabase();

    const teams = await Team.find({})
      .sort({ total_score: -1 })
      .lean();


    const leaderboard = teams.map((team: any, index: number) => ({
      rank: index + 1,
      name: team.teamname,
      total_score: team.total_score,
      members: team.members || [],
    }));

  
    return NextResponse.json(
      {
        message: "Leaderboard fetched successfully",
        data: leaderboard,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/leaderboard", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

