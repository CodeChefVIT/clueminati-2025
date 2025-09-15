import Team from "@/lib/models/team";
import Question from "@/lib/models/question";

/**
 * Utility to give a question for a team for round two and a given difficulty.
 */
export async function giveQuestionRoundTwo(
  teamId: string,
  difficulty: "easy" | "medium" | "hard"
) {
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return { error: `Team with ID ${teamId} not found` };
    }

    const allQuestions = await Question.find({
      round: "2",
      difficulty,
    });
    if (!allQuestions.length) {
      return {
        error: `No questions found for round 2 (${difficulty})`,
      };
    }

    const encounteredIds: string[] =
      team.round2?.questions_encountered[difficulty] || [];

    const remaining = allQuestions.filter(
      (q) => !encounteredIds.includes(q._id.toString())
    );

    if (!remaining.length) {
      return {
        error: `All ${difficulty} questions already encountered for round 2`,
      };
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const selectedQuestion = remaining[randomIndex];

    team.round2?.questions_encountered[difficulty].push(
      selectedQuestion._id.toString()
    );
    await team.save();

    return { question: selectedQuestion };
  } catch (err) {
    console.error("Error in giveQuestionRoundTwo:", err);
    return { error: "Internal server error" };
  }
}