import { NextRequest, NextResponse } from "next/server";
import Team from "@/lib/models/team";
import Question from "@/lib/models/question";
import { normalizeAnswer } from "@/utils/normalizeAnswer";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { ValidateQuestionSchema } from "@/lib/interfaces";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ValidateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const { questionId, userAnswer } = parsed.data;

    // Verify user
    const user = await getUserFromToken(req);
    if (!user || !user.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Fetch question
    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const roundKey = theQuestion.round === "1" ? "round1" : "round2";
    const difficulty = theQuestion.difficulty;

    // Prevent duplicate solves
    if (team[roundKey].questions_solved[difficulty].includes(questionId)) {
      return NextResponse.json({ message: "Question already solved" }, { status: 200 });
    }

    // Check correctness
    const isCorrect =
      normalizeAnswer(userAnswer as string) === normalizeAnswer(theQuestion.answer as string);

    if (!isCorrect) {
      return NextResponse.json({ message: "incorrect" }, { status: 200 });
    }

    // ✅ Correct Answer → Update team progress
    team[roundKey].questions_solved[difficulty].push(questionId);

    const points =
      difficulty === "easy" ? 10 :
      difficulty === "medium" ? 40 :
      70;

    team[roundKey].score += points;
    team.total_score += points;

    // --- Special Round 2 Logic ---
    let revealChar: string | null = null;

    if (roundKey === "round2") {
      const totalSolved = Object.values(team.round2.questions_solved).flat().length;
      const revealSteps = [3, 5, 7];

      let revealChar = null;
      if (revealSteps.includes(totalSolved)) {
        const idx = team.round2.secret_chars_revealed;
        if (idx < team.round2.secret_string.length) {
          revealChar = team.round2.secret_string[idx];
          team.round2.secret_chars_revealed++;
        }
      }
    }

    await team.save();

    return NextResponse.json({
      message: "correct",
      ...(revealChar ? { reveal: revealChar } : {}),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
