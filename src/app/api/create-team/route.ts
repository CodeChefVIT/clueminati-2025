import { TeamSchema } from "@/lib/interfaces";
import Team from "@/lib/models/team";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = TeamSchema.parse(data);
    const newTeam = await Team.create(parsed);
    return NextResponse.json(
      { message: "Team Created Successfully", data: newTeam },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("error creating team", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
