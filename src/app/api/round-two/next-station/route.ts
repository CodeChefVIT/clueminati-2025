import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import Team from "@/lib/models/team";
import Station from "@/lib/models/station";

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await Team.findById(tUser.teamId);
    if (!team || !team.round2) {
      return NextResponse.json({ error: "Team not found or round2 not started" }, { status: 404 });
    }

    const currentStation = team.round2.currentStation ?? null;
    const previousStation = (team.round2 as any)?.previousStation ?? null;

    const allStations = await Station.find({});
    if (!allStations || allStations.length === 0) {
      return NextResponse.json({ error: "No stations available" }, { status: 400 });
    }

    let candidateStations = allStations;
    if (currentStation && previousStation && allStations.length > 2) {
      const exclude = new Set([currentStation, previousStation]);
      candidateStations = allStations.filter((s) => !exclude.has(s._id.toString()));
    } else if (currentStation) {
      candidateStations = allStations.filter((s) => s._id.toString() !== currentStation);
    }

    if (candidateStations.length === 0) {
      return NextResponse.json({ error: "No alternative station available" }, { status: 400 });
    }

    const randomIndex = Math.floor(Math.random() * candidateStations.length);
    const nextStation = candidateStations[randomIndex];

    (team.round2 as any).previousStation = currentStation ?? null;
    team.round2.currentStation = nextStation._id.toString();
    await team.save();

    return NextResponse.json({
      message: "Next station",
      data: {
        stationId: nextStation._id,
        station_name: nextStation.station_name,
      },
    });
  } catch (err) {
    console.error("Error in nextStation route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}