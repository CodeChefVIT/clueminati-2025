import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Team from "@/lib/models/team";
import { getUserFromToken } from "@/utils/getUserFromToken";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await getUserFromToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = payload as { id: string };
    const { joinCode } = await req.json();

    if (!joinCode) {
      return NextResponse.json(
        { error: "Join code is required" },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ joinCode });
    if (!team) {
      return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.teamId) {
      return NextResponse.json(
        { error: "User already in a team" },
        { status: 400 }
      );
    }
    if (team.members.length >= 5) {
      return NextResponse.json({ error: "The Team Already has 5 members" }, { status: 400 });
    }

    user.teamId = team._id.toString();
    user.region = undefined; // Explicitly clear region on joining a new team
    await user.save();

    team.members.push(user._id.toString());
    await team.save();
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

    const res = NextResponse.json(
      { message: "Successfully joined the team", team },
      { status: 200 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Error joining team:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
