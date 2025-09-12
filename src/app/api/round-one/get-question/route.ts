import { getUserFromToken } from "@/app/utils/getUserFromToken";
import { giveQuestion } from "@/app/utils/giveQuestion";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

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
