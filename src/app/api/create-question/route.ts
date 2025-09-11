import { connectToDatabase } from "@/lib/db";
import { QuestionSchema } from "@/lib/interfaces";
import Question from "@/lib/models/question";
import { NextResponse } from "next/server";
import z from "zod";

connectToDatabase();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = QuestionSchema.parse(body);
    const newQuestion = await Question.create(parsed);
    return NextResponse.json(
      { message: "question created successfully", data: newQuestion },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message},
        { status: 400 }
      );
    }
    console.error("error creating question", err)
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  }
}
