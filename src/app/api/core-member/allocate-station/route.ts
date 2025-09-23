import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Station from "@/lib/models/station";
import { NextRequest, NextResponse } from "next/server";

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

    if (user.role !== "core_member") {
      return NextResponse.json({ error: "Only core members can be allocated stations" }, { status: 403 });
    }

    const { stationId } = await req.json();
    
    if (!stationId) {
      return NextResponse.json({ error: "Station ID is required" }, { status: 400 });
    }

    const station = await Station.findById(stationId);
    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    user.core_allocated_station = stationId;
    await user.save();

    return NextResponse.json({
      message: "Station allocated successfully",
      success: true,
      station: {
        id: station._id,
        name: station.station_name,
        difficulty: station.difficulty
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error allocating station:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}