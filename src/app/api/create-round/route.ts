import { connectToDatabase } from "@/lib/db";
import { GameStatSchema } from "@/lib/interfaces";
import GameStat from "@/lib/models/gameStat";
import { NextResponse } from "next/server";
import z from "zod";

connectToDatabase();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = GameStatSchema.parse(body);
    const existing = await GameStat.findOne();
    if (existing) {
      return NextResponse.json(
        { error: "A round already exists" },
        { status: 400 }
      );
    }
    const newGame = await GameStat.create(parsed);
    return NextResponse.json(
      { message: "Game Created Successfully", data: newGame },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("error creating question", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
