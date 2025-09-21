import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import { assignTeamString } from "./assignTeamString";

export async function autoAssignSecretStrings() {
  try {
    await connectToDatabase();

    // Get all teams that don't have secret strings yet
    const teamsWithoutStrings = await Team.find({
      $or: [
        { "round2.secret_string": { $exists: false } },
        { "round2.secret_string": null },
        { "round2.secret_string": "" }
      ]
    });

    let assignedCount = 0;

    for (const team of teamsWithoutStrings) {
      // Initialize round2 if it doesn't exist
      if (!team.round2) {
        team.round2 = {
          questions_solved: { easy: [], medium: [], hard: [] },
          questions_encountered: { easy: [], medium: [], hard: [] },
          score: 0,
          game_score: 0,
          indoor_score: 0,
          secret_string: assignTeamString(), // Assign here during initialization
          secret_chars_revealed: 0,
          string_validated: false,
          string_score: 0,
          path: [],
          currentStation: "",
          previousStation: "",
          solvedStations: [],
          letters_found: []
        };
      } else {
        // Assign secret string to existing round2
        team.round2.secret_string = assignTeamString();
      }
      
      await team.save({ validateBeforeSave: false });
      assignedCount++;
    }

    console.log(`🔤 Auto-assigned secret strings to ${assignedCount} teams`);
    return { assignedCount, totalTeams: teamsWithoutStrings.length };

  } catch (error) {
    console.error("Error auto-assigning secret strings:", error);
    throw error;
  }
}