import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/lib/models/team";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (tUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    if (!page) {
      return NextResponse.json({ error: "Provide the page number" }, { status: 400 });
    }

    const teams = await Team.aggregate([
      {
        $project: {
          teamname: 1,
          members: 1,
          total_score: { $add: ["$round1.indoor_score", "$round2.indoor_score"] },
          secret_string: "$round2.secret_string", // add this line
        },
      },
      { $sort: { total_score: -1 } },
      { $skip: (+page - 1) * 10 },
      { $limit: 10 },
    ]);

    const leaderboard = teams.map((team: any, index: number) => ({
      rank: index + 1,
      name: team.teamname,
      total_score: team.total_score,
      members: team.members || [],
      secret_string: team.secret_string || "", // fallback if undefined
    }));

    return NextResponse.json(
      { message: "Leaderboard fetched successfully", data: leaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/get-indoor-Leaderboard", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
