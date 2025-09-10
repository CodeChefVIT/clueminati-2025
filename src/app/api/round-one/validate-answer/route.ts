import { normalizeAnswer } from "@/app/utils/normalizeAnswer";
import { connectToDatabase } from "@/lib/db";
import { ValidateQuestionSchema } from "@/lib/interfaces";
import Question from "@/lib/models/question";
import Team from "@/lib/models/team";
import { NextResponse } from "next/server";

connectToDatabase();
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = ValidateQuestionSchema.parse(body);
    const { teamId, questionId, userAnswer } = parsed;

    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    const isCorrect =
      normalizeAnswer(userAnswer as string) ===
      normalizeAnswer(theQuestion?.answer as string);
    if (!isCorrect) {
      return NextResponse.json({ message: "incorrect" }, { status: 200 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const difficulty = theQuestion.difficulty;
    team.round1?.questions_solved[difficulty].push(questionId);
    const points =
      difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;

    if (team.round1) {
      team.round1.score += points;
    }
    team.total_score += points;
    await team.save();
    return NextResponse.json(
      { message: "correct", data: theQuestion },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "internal server " + e },
      { status: 500 }
    );
  }
}
