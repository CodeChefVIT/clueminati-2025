import { getUserFromToken } from '@/utils/getUserFromToken';
import { normalizeAnswer } from '@/utils/normalizeAnswer';
import { connectToDatabase } from '@/lib/db';
import { ValidateQuestionSchema } from '@/lib/interfaces';
import Question from '@/lib/models/question';
import Team from '@/lib/models/team';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/lib/getDataFromToken';
import User from '@/lib/models/user';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ValidateQuestionSchema.parse(body);
    const userId = await getDataFromToken(req);

    const user = await User.findOne({ _id: userId }).select(
      '-password -isVerified -verifyToken -verifyTokenExpiry'
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { questionId, userAnswer } = parsed;
    const teamId = user.teamId;

    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (theQuestion.round !== '1') {
      return NextResponse.json(
        { error: 'This question does not belong to Round 1' },
        { status: 400 }
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const difficulty = theQuestion.difficulty;
    if (team.round1?.questions_solved[difficulty].includes(questionId)) {
      return NextResponse.json(
        { message: 'Question already solved' },
        { status: 200 }
      );
    }

    const isCorrect =
      normalizeAnswer(userAnswer as string) ===
      normalizeAnswer(theQuestion.answer as string);
    if (!isCorrect) {
      return NextResponse.json({ message: 'incorrect' }, { status: 200 });
    }

    team.round1?.questions_solved[difficulty].push(questionId);
    const points =
      difficulty === 'easy' ? 10 : difficulty === 'medium' ? 40 : 70;

    if (team.round1) {
      team.round1.score += points;
    }
    team.total_score += points;

    await team.save();

    return NextResponse.json(
      { message: 'correct', data: theQuestion },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error validating question:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
