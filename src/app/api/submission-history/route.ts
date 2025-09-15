import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import Question from "@/lib/models/question";
import { getUserFromToken } from "@/utils/getUserFromToken";
import User from "@/lib/models/user";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const tUser = await getUserFromToken(req);
  if (!tUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(tUser.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const teamId = user.teamId;
  if (!teamId) {
    return NextResponse.json({ solved: [] }, { status: 200 });
  }

  await connectToDatabase();

  const team = await Team.findById(teamId).lean();
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  type Difficulty = "easy" | "medium" | "hard";

  const r1Solved = (team.round1?.questions_solved as Record<
    Difficulty,
    string[]
  >) || {
    easy: [],
    medium: [],
    hard: [],
  };

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  // Build list of all solved questionIds with difficulty
  const allSolvedInfo = difficulties.flatMap((difficulty) =>
    (r1Solved[difficulty] || []).map((questionId) => ({
      questionId,
      difficulty,
    }))
  );

  // ✅ Filter invalid ObjectIds
  const allQuestionIds = allSolvedInfo
    .map((info) => info.questionId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  // Fetch questions
  const questions = await Question.find({
    _id: { $in: allQuestionIds },
  }).lean();

  // Map questionId -> description
  const questionsMap = new Map(
    questions.map((q) => [q._id.toString(), q.question_description])
  );

  // Build final solved list
  const solved = allSolvedInfo.map((info) => ({
    ...info,
    questionDescription: questionsMap.get(info.questionId) || null,
  }));

  return NextResponse.json({
    solved,
  });
}
