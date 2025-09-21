import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/lib/models/user";
import Station from "@/lib/models/station";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "core_member") {
      return NextResponse.json(
        { error: "Access denied. Core member role required." },
        { status: 403 }
      );
    }

    const { stationId } = await req.json();

    if (!stationId) {
      return NextResponse.json(
        { error: "Station ID is required" },
        { status: 400 }
      );
    }

    // verify the station exists
    const station = await Station.findById(stationId);
    if (!station) {
      return NextResponse.json(
        { error: "Station not found" },
        { status: 404 }
      );
    }

    // update user"s allocated station
    user.core_allocated_station = stationId;
    await user.save();

    // Generate new JWT token with updated user data
    const newToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        core_allocated_station: stationId
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // Set new token as a cookie
    const response = NextResponse.json({
      success: true,
      message: "Station allocated successfully",
      stationName: station.station_name
    });
    
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error("Error allocating station:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}