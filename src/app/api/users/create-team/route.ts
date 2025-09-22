import { generateJoinCode } from "@/utils/generateJoinCode";
import { assignTeamString } from "@/utils/assignTeamString";
import { assignNextStation } from "@/utils/assignNextStation";
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
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const parsed = TeamSchema.parse(data);

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found", data: tUser }, // debug-friendly ++++
        { status: 404 }
      );
    }

    if (user.teamId) {
      return NextResponse.json(
        { redirect: "/role-selection" },
        { status: 200 }
      );
    }

    let code: string;
    let existing;
    do {
      code = generateJoinCode();
      existing = await Team.findOne({ joinCode: code });
    } while (existing);
    
    const teamString = assignTeamString();
    const newTeam = await Team.create({
      ...parsed,
      joinCode: code,
      members: [tUser.id],
      teamString: teamString,
    });
    
    console.log(`Team "${parsed.teamname}" created with secret string: "${teamString}"`);
    
    // Assign initial station for Round 2
    try {
      const stationResult = await assignNextStation(newTeam._id.toString());
      if ('error' in stationResult) {
        console.warn(`Could not assign initial station to team "${parsed.teamname}": ${stationResult.error}`);
      } else {
        console.log(`Team "${parsed.teamname}" assigned initial station: ${stationResult.station_name} (${stationResult.stationId})`);
      }
    } catch (error) {
      console.error(`Error assigning initial station to team "${parsed.teamname}":`, error);
    }
    
    user.teamId = newTeam._id.toString();
    user.region = undefined;
    await user.save();

    // ASSigning a fresh JWT so client has updated teamId
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
