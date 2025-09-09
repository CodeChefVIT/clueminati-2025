//this is a temp route just to create dummy users please delete this once signup and login are done

import { connectToDatabase } from "@/lib/db";
import { UserSchema } from "@/lib/interfaces";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import z from "zod";

connectToDatabase();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = UserSchema.parse(body);
    const newUser = await User.create(parsed);
    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("error creating user", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
