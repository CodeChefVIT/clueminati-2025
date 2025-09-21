import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { getCurrentRound } from "@/utils/getRound";
import { giveQuestion } from "@/utils/giveQuestion";
import User from "@/lib/models/user";
import Team from "@/lib/models/team";
import Station from "@/lib/models/station";

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

    if (user.role === "participant") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const currentRound = await getCurrentRound();
    if (currentRound === "not_started" || currentRound === "finished") {
      return NextResponse.json(
        { error: `Game is ${currentRound}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { teamId, difficulty } = body as {
      teamId?: string;
      difficulty?: "easy" | "medium" | "hard";
    };

    if (!teamId || !difficulty) {
      return NextResponse.json(
        { error: "teamId and difficulty are required" },
        { status: 400 }
      );
    }

    let result;

    if (currentRound === "1") {
      result = await giveQuestion(teamId, difficulty);
    } else if (currentRound === "2") {
      const user = await User.findById(tUser.id);
      const stationId = user?.core_allocated_station;
      const team = await Team.findById(teamId);
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      const station = await Station.findById(stationId);
      if (!station) {
        return NextResponse.json({ error: "Station not found" }, { status: 404 });
      }

      if (!team.round2) {
        return NextResponse.json(
          { error: "Team is not participating in Round 2" },
          { status: 400 }
        );
      }

      if (team.round2.currentStation !== stationId) {
        return NextResponse.json(
          {
            error:
              "Access denied: You can only get questions from your currently assigned station",
            currentStation: team.round2.currentStation,
            requestedStation: stationId
          },
          { status: 403 }
        );
      }

      if (user?.core_allocated_station !== stationId) {
        return NextResponse.json(
          { 
            error: "Access denied: You are not allocated to serve questions for this station",
            coreAllocatedStation: user?.core_allocated_station,
            requestedStation: stationId
          },
          { status: 403 }
        );
      }

      if (
        team.round2.solvedStations &&
        team.round2.solvedStations.includes(stationId)
      ) {
        return NextResponse.json(
          {
            error:
              "Station already completed. Please wait for your next station assignment.",
            completedStations: team.round2.solvedStations,
          },
          { status: 400 }
        );
      }

      result = await giveQuestion(teamId, difficulty);
    }

    if (!result) {
      return NextResponse.json(
        { error: "No question available" },
        { status: 400 }
      );
    }

    if (typeof result === "object" && "error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "successfully fetched question",
        data: result.question || result,
        round: currentRound,
        ...(currentRound === "2"
          ? {
              currentStation: (await Team.findById(teamId))?.round2
                ?.currentStation,
            }
          : {}),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in serve-question:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
