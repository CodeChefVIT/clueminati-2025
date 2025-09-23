// src/app/api/core-member/allocate-station/route.ts
import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Station from "@/lib/models/station";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // parse body
    const { stationId } = await req.json();
    if (!stationId) {
      return NextResponse.json(
        { error: "Station ID is required" },
        { status: 400 }
      );
    }

    // verify user exists & role
    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role !== "core_member") {
      return NextResponse.json(
        { error: "Only core members can be allocated stations" },
        { status: 403 }
      );
    }

    // verify station exists
    const station = await Station.findById(stationId);
    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Allocate station
    user.core_allocated_station = stationId;
    await user.save();

    // Generate new token
    const payload = {
      id: user._id,
      fullname: user.fullname,
      // reg_num: user.reg_num ?? null,
      email: user.email,
      role: user.role,
      // teamId: user.teamId ?? null,
      // region: user.region ?? null,
      core_allocated_station: user.core_allocated_station
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "7d"
    });

    const response = NextResponse.json({
      message: "Station allocated successfully",
      success: true,
      station: {
        id: station._id,
        name: station.station_name,
        difficulty: station.difficulty
      }
    }, { status: 200 });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 
    });

    return response;

  } catch (error) {
    console.error("Error allocating station:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
