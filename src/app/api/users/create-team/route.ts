import { generateJoinCode } from "@/app/utils/generateJoinCode";
import { getUserFromToken } from "@/app/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { TeamSchema } from "@/lib/interfaces";
import Team from "@/lib/models/team";
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
    const data = await req.json();
    const parsed = TeamSchema.parse(data);

    let code: string;
    let existing;

    do {
      code = generateJoinCode();
      existing = await Team.findOne({ joinCode: code });
    } while (existing); //to check whether a team already exists with the joincode (highly unlikely)
    const newTeam = await Team.create({
      ...parsed,
      joinCode: code,
      members: [tUser.id],
    });
    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found", data: tUser}, { status: 404 });
    }
    user.teamId = newTeam._id.toString();
    await user.save();

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
