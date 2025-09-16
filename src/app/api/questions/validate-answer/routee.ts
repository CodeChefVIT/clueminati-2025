// src/app/api/questions/validate-answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import Team from "@/lib/models/team";
import Question from "@/lib/models/question";
import { getDataFromToken } from "@/lib/getDataFromToken";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { questionId, answer } = await req.json();
    const userId = await getDataFromToken(req);

    const team = await Team.findOne({ members: userId });
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    const roundKey = theQuestion.round === "1" ? "round1" : "round2";
    const difficulty = theQuestion.difficulty;

    // ✅ Ensure round exists on team
    if (!team[roundKey]) {
      return NextResponse.json({ message: `Round data missing for ${roundKey}` }, { status: 400 });
    }

    // ✅ Prevent duplicate solves
    if (team[roundKey].questions_solved[difficulty].includes(questionId)) {
      return NextResponse.json({ message: "Question already solved" }, { status: 400 });
    }

    // ✅ Normalize and check answer
    const normalizeAnswer = (str: string) =>
      str.toLowerCase().trim().replace(/\s+/g, " ");

    const isCorrect =
      normalizeAnswer(theQuestion.answer) === normalizeAnswer(answer);

    if (!isCorrect) {
      return NextResponse.json({ message: "Incorrect answer" }, { status: 400 });
    }

    // ✅ Add question to solved list
    team[roundKey].questions_solved[difficulty].push(questionId);

    // ✅ Points allocation
    const points =
      difficulty === "easy" ? 10 : difficulty === "medium" ? 40 : 70;

    team[roundKey].score += points;
    team.total_score += points;

    // ✅ Special Round 2 Logic: reveal secret string characters
    let revealChar: string | null = null;

    if (roundKey === "round2" && team.round2) {
      const revealSteps = [3, 5, 7]; // After 3rd, 5th, 7th solve
      const charsRevealed = team.round2.secret_chars_revealed;

      if (revealSteps.includes(charsRevealed + 1)) {
        // reveal next character
        if (charsRevealed < team.round2.secret_string.length) {
          revealChar = team.round2.secret_string[charsRevealed];
          team.round2.secret_chars_revealed += 1;
        }
      }
    }

    await team.save();

    return NextResponse.json({
      message: "Correct answer",
      points,
      totalScore: team.total_score,
      revealChar, // null if no reveal
    });
  } catch (error) {
    console.error("Error in validate-answer POST:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
