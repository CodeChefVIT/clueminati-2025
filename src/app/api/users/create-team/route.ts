import { generateJoinCode } from "@/utils/generateJoinCode";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { TeamSchema } from "@/lib/interfaces";
import Team from "@/lib/models/team";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// i made some changes to the file; if theres any probs lemme know - ayman
connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const data = await req.json();
    const parsed = TeamSchema.parse(data);

    // Fetch full user record
    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user already has a team, redirect
    if (user.teamId) {
      return NextResponse.json({ redirect: "/role-selection" }, { status: 200 });
    } 

    // Generate a unique join code
    let code: string;
    let existing;

    do {
      code = generateJoinCode();
      existing = await Team.findOne({ joinCode: code });
    } while (existing); //(highly unlikely but just in case)

    // Create new team
    const newTeam = await Team.create({
      ...parsed,
      joinCode: code,
      members: [tUser.id],
    });

    // Assign team to user and save
    user.teamId = newTeam._id.toString();
    await user.save();

    // Success response
    return NextResponse.json(
      {
        message: "Team Created Successfully",
        success: true,
        team: newTeam,
      },
      { status: 201 }
    );
  } catch (err) {
    // Validation error
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }

    // General error
    console.error("Error creating team:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
