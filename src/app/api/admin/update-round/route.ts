import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { GameStatSchema } from "@/lib/interfaces";
import GameStat from "@/lib/models/gameStat";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    const body = await req.json();
    const parsed = GameStatSchema.parse(body);

    const existing = await GameStat.findOne();

    if (existing) {
      Object.assign(existing, parsed); 
      await existing.save();

      return NextResponse.json(
        { message: "Game updated successfully", data: existing },
        { status: 200 }
      );
    }

    const newGame = await GameStat.create(parsed);
    return NextResponse.json(
      { message: "Game created successfully", data: newGame },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("Error creating/updating game", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
