import { getUserFromToken } from '@/utils/getUserFromToken';
import { connectToDatabase } from '@/lib/db';
import { QuestionSchema } from '@/lib/interfaces';
import Question from '@/lib/models/question';
import User from '@/lib/models/user';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

connectToDatabase();
export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const body = await req.json();
    const parsed = QuestionSchema.parse(body);
    const questionAlreadyExists = await Question.findOne(parsed);
    if (questionAlreadyExists) {
      return NextResponse.json(
        { message: 'Question already exists' },
        { status: 409 }
      );
    }
    const newQuestion = await Question.create(parsed);
    return NextResponse.json(
      { message: 'question created successfully', data: newQuestion },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.message },
        { status: 400 }
      );
    }
    console.error('error creating question', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
