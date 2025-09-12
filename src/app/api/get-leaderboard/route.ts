import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const teamsCollection = db.collection("Teams"); 

    const teams = await teamsCollection
      .find({})
      .sort({ total_score: -1 })
      .toArray();

    return NextResponse.json(
      {
        message: "Leaderboard fetched successfully",
        data: teams,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/leaderboard:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}