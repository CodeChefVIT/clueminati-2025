import { generateJoinCode } from "@/utils/generateJoinCode";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { TeamSchema } from "@/lib/interfaces";
import Team from "@/lib/models/team";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    // Authenticatting
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parsing tken & validating its body
    const data = await req.json();
    const parsed = TeamSchema.parse(data);

    // Get full user record
    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found", data: tUser }, // debug-friendly ++
        { status: 404 }
      );
    }

    // Prevent multiple teams
    if (user.teamId) {
      return NextResponse.json(
        { redirect: "/role-selection" },
        { status: 200 }
      );
    }

    // Generating unique join code
    let code: string;
    let existing;
    do {
      code = generateJoinCode();
      existing = await Team.findOne({ joinCode: code });
    } while (existing);

    // Creating team & linking to user
    const newTeam = await Team.create({
      ...parsed,
      joinCode: code,
      members: [tUser.id],
    });
    user.teamId = newTeam._id.toString();
    // Mongoose validation fails if region is undefined, as it casts to ''.
    // Explicitly setting it to null bypasses the enum validation for an empty value.
    if (!user.region) {
      user.region = undefined;
    }
    await user.save();

    // AsSigning a fresh JWT so client has updated teamId
    const tokenData = {
      id: user._id,
      fullname: user.fullname,
      reg_num: user.reg_num,
      email: user.email,
      role: user.role,
      teamId: user.teamId ?? null,
      region: user.region ?? null,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // 8. Build response and set cookie
    const res = NextResponse.json(
      {
        message: "Team Created Successfully",
        success: true,
        team: newTeam,
      },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day zyada nahi ho jaega? 12 hrs maybe ??
      path: "/",
    });

    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("Error creating team:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
