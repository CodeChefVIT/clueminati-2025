import { getUserFromToken } from '@/utils/getUserFromToken';
import { connectToDatabase } from '@/lib/db';
import Question from '@/lib/models/question';
import Team from '@/lib/models/team';
import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('id');
    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const team = await Team.findById(tUser.teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const difficulty = question.difficulty;
    const encounteredQuestions =
      team.round1?.questions_encountered?.[difficulty] || [];

    if (
      encounteredQuestions.length === 0 ||
      encounteredQuestions[encounteredQuestions.length - 1].toString() !==
        questionId
    ) {
      return NextResponse.json(
        { error: 'This is not the latest question for your team.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: 'Question fetched successfully', data: question },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching question by ID:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
