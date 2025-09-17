import { getUserFromToken } from '@/utils/getUserFromToken';
import { normalizeAnswer } from '@/utils/normalizeAnswer';
import { connectToDatabase } from '@/lib/db';
import { ValidateQuestionSchema } from '@/lib/interfaces';
import Question from '@/lib/models/question';
import Team from '@/lib/models/team';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/user';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const parsed = ValidateQuestionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { questionId, userAnswer } = parsed.data;

    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ _id: tUser.id }).select(
      '-password -isVerified -verifyToken -verifyTokenExpiry'
    );

    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'User not found or not in a team' }, { status: 404 });
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // validate this is a round 2 question
    if (theQuestion.round !== '2') {
      return NextResponse.json(
        { error: 'This question does not belong to Round 2' },
        { status: 400 }
      );
    }

    const difficulty = theQuestion.difficulty;

    // check if question already solved
    if (team.round2?.questions_solved[difficulty].includes(questionId)) {
      return NextResponse.json(
        { message: 'Question already solved' },
        { status: 200 }
      );
    }

    // check answer correctness
    const isCorrect =
      normalizeAnswer(userAnswer as string) ===
      normalizeAnswer(theQuestion.answer as string);

    if (!isCorrect) {
      return NextResponse.json({ message: 'incorrect' }, { status: 200 });
    }

    team.round2?.questions_solved[difficulty].push(questionId);

    const points =
      difficulty === 'easy' ? 10 : 
      difficulty === 'medium' ? 40 : 
      70;

    // update scores
    if (team.round2) {
      team.round2.score += points;
    }
    team.total_score += points;

    //r2 logic for revealing secret string characters
    let revealChar: string | null = null;
    
    if (team.round2) {
      // calc total questions solved across all difficulties
      const totalSolved = Object.values(team.round2.questions_solved).flat().length;
      const revealSteps = [3, 5, 7];                                                   ///////// Reveal at 3rd, 5th, and 7th question

      if (revealSteps.includes(totalSolved)) {
        const idx = team.round2.secret_chars_revealed || 0;
        if (team.round2.secret_string && idx < team.round2.secret_string.length) {
          revealChar = team.round2.secret_string[idx];
          team.round2.secret_chars_revealed = (team.round2.secret_chars_revealed || 0) + 1;
        }
      }
    }

    await team.save();

    // return response with optional character reveal
    const response = {
      message: 'correct',
      data: theQuestion,
      ...(revealChar ? { reveal: revealChar } : {})
    };

    return NextResponse.json(response, { status: 200 });

  } catch (e) {
    console.error('Error validating Round 2 question:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}