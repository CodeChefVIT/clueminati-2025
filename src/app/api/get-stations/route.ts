import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { getAllStations } from "@/utils/getAllStations";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

   
    
    const stations = await getAllStations();

    return NextResponse.json({
      success: true,
      stations: stations,
      currentAllocation: user.core_allocated_station || null
    }, { status: 200 });

  } catch (error) {
    console.error("Error getting stations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}