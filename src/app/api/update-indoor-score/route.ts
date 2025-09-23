import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import User from "@/lib/models/user";
import { getUserFromToken } from "@/utils/getUserFromToken";
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
    if (!user.teamId) {
      return NextResponse.json(
        { error: "You are not part of any team" },
        { status: 400 }
      );
    }
    const team = await Team.findById(user.teamId);

    const reqBody = await req.json();
    const { indoorScore, round } = reqBody;

    if (round !== "1" && round !== "2") {
      return NextResponse.json(
        { error: "Invalid round. Must be '1' or '2'." },
        { status: 400 }
      );
    }

    const roundKey = round === "1" ? "round1" : "round2";

    if (team![roundKey]!.indoor_score === 0) {
      team![roundKey]!.indoor_score = +indoorScore;
      team!.total_score += +indoorScore;
      await team!.save();
      return NextResponse.json(
        { message: `The score for round ${round} has been updated` },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        error: `The score for the indoor has already been updated in round ${round}`,
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("Error updating indoor score:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}