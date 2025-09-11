import { giveQuestion } from "@/app/utils/giveQuestion";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

connectToDatabase();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const difficulty = searchParams.get("difficulty") as
      | "easy"
      | "medium"
      | "hard"
      | null;

    if (!teamId || !difficulty) {
      return NextResponse.json(
        { error: "teamId and difficulty are required" },
        { status: 400 }
      );
    }

    const result = await giveQuestion(teamId, difficulty);

    if ("error" in result) {
      return NextResponse.json(
        { error: "Error fetching question", data: result },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "successfully fetched question", data: result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/get-question:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}