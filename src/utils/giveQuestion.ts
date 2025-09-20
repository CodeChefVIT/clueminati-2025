import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import { getCurrentRound } from "./getRound";
import Question from "@/lib/models/question";

export async function giveQuestion(
  teamId: string,
  difficulty: "easy" | "medium" | "hard"
) {
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return { error: `Team with ID ${teamId} not found` };
    }

    const round = await getCurrentRound();
    if (round === "not_started" || round === "finished") {
      return { error: `No active round right now` };
    }
    const allQuestions = await Question.find({
      round: round,
      difficulty,
    }).select(" -answer");
    if (!allQuestions.length) {
      return {
        error: `No questions found for round ${round} (${difficulty})`,
      };
    }
    const roundKey = `round${round}` as "round1" | "round2";

    const encounteredIds: string[] =
      team[roundKey]?.questions_encountered[difficulty] || [];

    const remaining = allQuestions.filter(
      (q) => !encounteredIds.includes(q._id.toString())
    );

    if (!remaining.length) {
      return {
        error: `All ${difficulty} questions already encountered for round ${round}`,
      };
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const selectedQuestion = remaining[randomIndex];

    team[roundKey]?.questions_encountered[difficulty].push(
      selectedQuestion._id.toString()
    );
    await team.save();
    return { question: selectedQuestion };
  } catch (err) {
    console.error("Error fetching team:", err);
    return { error: "Internal server error" };
  }
}
