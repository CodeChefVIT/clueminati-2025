import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import Question from "@/lib/models/question"; 

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });
  }

  await connectToDatabase();

  const team = await Team.findById(teamId).lean();
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  type Difficulty = 'easy' | 'medium' | 'hard';

  const r1Solved = team.round1?.questions_solved as Record<Difficulty, string[]> || { easy: [], medium: [], hard: [] };
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const solved: Array<{ questionId: string, difficulty: string, questionDescription: string | null }> = [];

  for (const difficulty of difficulties) {
    const questionIds: string[] = r1Solved[difficulty] || [];
    for (const questionId of questionIds) {
      const question = await Question.findById(questionId).lean();
      solved.push({
        questionId,
        difficulty,
        questionDescription: question?.question_description || null,
      });
    }
  }

  return NextResponse.json({
    solved,
  });
}
