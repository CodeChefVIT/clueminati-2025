// src/app/api/core-member/allocate-station/route.ts
import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Station from "@/lib/models/station";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

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

    // update allocation WITHOUT running full model validators (avoids reg_num issue)
    await User.updateOne(
      { _id: tUser.id },
      { $set: { core_allocated_station: stationId } },
      { runValidators: false }
    );

    // fetch updated user (lean is ok)
    const updatedUser = await User.findById(tUser.id).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    // create a new token including the station claim
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET || "");
    const payload: any = {
      id: updatedUser._id.toString(),
      role: updatedUser.role,
      station: stationId,
    };

    // ✅ preserve extra fields if present
    if (updatedUser.teamId) payload.teamId = updatedUser.teamId;
    if (updatedUser.region) payload.region = updatedUser.region;
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("12h")
      .sign(secret);

    // return JSON response and SET cookie on the response
    const response = NextResponse.json(
      {
        message: "Station allocated successfully",
        success: true,
        station: {
          id: station._id,
          name: station.station_name,
          difficulty: station.difficulty,
        },
      },
      { status: 200 }
    );

    // Set cookie on the response so browser receives it
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Error allocating station:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
