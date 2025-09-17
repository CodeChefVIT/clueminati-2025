import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { getCurrentRound } from "@/utils/getRound";
import User from "@/lib/models/user";
import Question from "@/lib/models/question";

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

    // Get current round
    const currentRound = await getCurrentRound();
    if (currentRound === "not_started" || currentRound === "finished") {
      return NextResponse.json(
        { error: `Game is ${currentRound}` },
        { status: 400 }
      );
    }

    // Get questionId from query params
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("id");

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Fetch the specific question by ID
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Verify question belongs to current round
    if (question.round !== currentRound) {
      return NextResponse.json(
        { 
          error: `Question belongs to Round ${question.round}, but current round is ${currentRound}` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully fetched question", 
        data: question,
        round: currentRound
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in get-question-by-id:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}