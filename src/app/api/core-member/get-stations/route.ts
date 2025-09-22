import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Station from "@/lib/models/station";

export async function GET() {
  try {
    await connectToDatabase();
    
    const stations = await Station.find({}, 'station_name difficulty').lean();
    
    const stationOptions = stations.map(station => ({
      id: station._id.toString(),
      station_name: station.station_name,
      difficulty: station.difficulty || 'medium'
    }));

    return NextResponse.json({ stations: stationOptions });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
