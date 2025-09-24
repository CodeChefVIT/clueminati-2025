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
          total_score: { $add: ["$total_score","$round1.indoor_score", "$round2.indoor_score"] },
          secret_string: "$round2.secret_string", // include secret_string
          _id : 1,
          lastQuestionAnsweredAt:1,
        },
      },
      { 
        $sort: { 
          total_score: -1,
          _id : 1
        } 
      },
      { $skip: (+page - 1) * 10 },
      { $limit: 10 },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "memberId",
              in: {"$toObjectId": "$$memberId"}
            }
          }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "members", 
          foreignField: "_id", 
          as: "memberDetails", 
        },
      },
      {
        $project: {
          teamname: "$teamname",
          total_score: "$total_score",
          secret_string: "$secret_string",
          members: {
            $map: {
              input: "$members",
              as: "memberId",
              in: {
                $cond: {
                  if: { $in: ["$$memberId", "$memberDetails._id"] },
                  then: {
                    $arrayElemAt: ["$memberDetails.fullname", { $indexOfArray: ["$memberDetails._id", "$$memberId"] }]
                  },
                  else: "Unknown User" 
                }
              }
            }
          }, 
          lastQuestionAnsweredAt: "$lastQuestionAnsweredAt",
        },
      },
    ]);

    const leaderboard = teams.map((team: any, index: number) => {

      const LastUpdatedTime = team.lastQuestionAnsweredAt ? new Date(team.lastQuestionAnsweredAt) : new Date("1900-1-1 00:09:00+05:30") ;
      const formattedTime = `${String(LastUpdatedTime.getHours()).padStart(2,'0')}:${String(LastUpdatedTime.getMinutes()).padStart(2,'0')}`;

      return {rank: index + 1,
      name: team.teamname,
      total_score: team.total_score,
      secret_string: team.secret_string || "", // added secret_string over here..empty for now cuz not added in db
      members: team.members || [],
      lastQuestionAnsweredAt: formattedTime,
    }});

    return NextResponse.json(
      { message: "Leaderboard fetched successfully", data: leaderboard, totalCount: await Team.countDocuments() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/getLeaderboard", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
