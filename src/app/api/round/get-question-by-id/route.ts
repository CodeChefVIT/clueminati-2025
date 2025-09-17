// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import { getUserFromToken } from "@/utils/getUserFromToken";
// import { getCurrentRound } from "@/utils/getRound";
// import { giveQuestion } from "@/utils/giveQuestion";
// import { giveQuestionRoundTwo } from "@/utils/giveQuestionRoundTwo";
// import User from "@/lib/models/user";
// import Team from "@/lib/models/team";
// import Station from "@/lib/models/station";
// import Question from "@/lib/models/question";

// connectToDatabase();

// export async function GET(req: NextRequest) {
//   try {
//     const tUser = await getUserFromToken(req);
//     if (!tUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await User.findById(tUser.id);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (user.role === "participant") {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     // Get current round
//     const currentRound = await getCurrentRound();
//     if (currentRound === "not_started" || currentRound === "finished") {
//       return NextResponse.json(
//         { error: `Game is ${currentRound}` },
//         { status: 400 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const teamId = searchParams.get("teamId");
//     const difficulty = searchParams.get("difficulty") as
//       | "easy"
//       | "medium"
//       | "hard"
//       | null;

//     if (!teamId || !difficulty) {
//       return NextResponse.json(
//         { error: "teamId and difficulty are required" },
//         { status: 400 }
//       );
//     }

//     let result;

//     if (currentRound === "1") {
//       // Round 1 logic
//       result = await giveQuestion(teamId, difficulty);
//     } else if (currentRound === "2") {
//       // Round 2 logic - requires stationId
//       const stationId = searchParams.get("stationId");
      
//       if (!stationId) {
//         return NextResponse.json(
//           { error: "stationId is required for Round 2" },
//           { status: 400 }
//         );
//       }

//       const team = await Team.findById(teamId);
//       if (!team) {
//         return NextResponse.json({ error: "Team not found" }, { status: 404 });
//       }

//       const station = await Station.findById(stationId);
//       if (!station) {
//         return NextResponse.json({ error: "Station not found" }, { status: 404 });
//       }

//       result = await giveQuestionRoundTwo(teamId, difficulty);
//     }

//     if ("error" in result) {
//       return NextResponse.json(
//         { error: result.error },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         message: "successfully fetched question", 
//         data: currentRound === "1" ? result : result.question,
//         round: currentRound
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("Error in serve-question:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { getCurrentRound } from "@/utils/getRound";
import User from "@/lib/models/user";
import Question from "@/lib/models/question";

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

    if (user.role === "participant") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get current round
    const currentRound = await getCurrentRound();
    if (currentRound === "not_started" || currentRound === "finished") {
      return NextResponse.json(
        { error: `Game is ${currentRound}` },
        { status: 400 }
      );
    }

    // Get questionId from query params
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("id");

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Fetch the specific question by ID
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Verify question belongs to current round
    if (question.round !== currentRound) {
      return NextResponse.json(
        { 
          error: `Question belongs to Round ${question.round}, but current round is ${currentRound}` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully fetched question", 
        data: question,
        round: currentRound
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in get-question-by-id:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}