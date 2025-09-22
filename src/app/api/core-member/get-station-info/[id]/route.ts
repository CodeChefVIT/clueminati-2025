import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Station from "@/lib/models/station";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id: stationId } = await params;
    
    if (!stationId) {
      return NextResponse.json(
        { error: "Station ID is required" },
        { status: 400 }
      );
    }

    const station = await Station.findById(stationId, 'station_name difficulty').lean();
    
    if (!station) {
      return NextResponse.json(
        { error: "Station not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      stationName: station.station_name,
      difficulty: station.difficulty
    });
  } catch (error) {
    console.error('Error fetching station info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch station information' },
      { status: 500 }
    );
  }
}