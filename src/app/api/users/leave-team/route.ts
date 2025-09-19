import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import User from "@/lib/models/user";
import Team from "@/lib/models/team";
import { IEvent } from "@/lib/interfaces";
import { getCurrentRound } from "@/utils/getRound";
import jwt from "jsonwebtoken";

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

    if (!user.teamId) {
      return NextResponse.json(
        { error: "You are not part of any team" },
        { status: 400 }
      );
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const currentRound = await getCurrentRound();
    console.log(currentRound);
    if (currentRound !== "not_started") {
      return NextResponse.json(
        { error: `Cannot leave team now since the game has started` },
        { status: 400 }
      );
    }

    team.members = team.members.filter(
      (id) =>
        id !== undefined && id !== null && id.toString() !== user._id.toString()
    );
    await team.save();

    user.teamId = undefined;
    await user.save();
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
      { message: "You have left the team successfully" },

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
    console.error("Error leaving team:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
