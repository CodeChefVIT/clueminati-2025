import GameStat from "@/lib/models/gameStat";
import {connectToDatabase} from "@/lib/db";

export async function getCurrentRound(): Promise<"not_started" | "1" | "2" | "finished"> {
  
  try{
    await connectToDatabase();
    const gameStat = await GameStat.findOne();
    if (!gameStat) return "not_started";
    
    const now = new Date().getTime(); 
    const r1Start = gameStat.r1StartTime.getTime();
    const r1End = gameStat.r1EndTime.getTime();
    const r2Start = gameStat.r2StartTime?.getTime();
    const r2End = gameStat.r2EndTime?.getTime();

    // Before round 1 starts
    if (now < r1Start) {
      return "not_started";
    }

    // During round 1
    if (now >= r1Start && now <= r1End) {
      return "1";
    }

    // During round 2
    if (r2Start && now >= r2Start) {
      // If r2EndTime exists and we're past it, game is finished
      if (r2End && now > r2End) {
        return "finished";
      }
      // Otherwise, we're in round 2
      return "2";
    }

    // Between rounds or after round 1 but before round 2
    if (now > r1End && (!r2Start || now < r2Start)) {
      return "finished"; // Or return "between_rounds" if you have that state
    }

  return "finished";
  }
  catch (error) {
    console.error("Error in getCurrentRound:", error);
    throw new Error("Failed to get round");
  }
}
