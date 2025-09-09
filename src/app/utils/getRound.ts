import GameStat from "@/lib/models/gameStat";

export async function getCurrentRound(): Promise<"not_started" | "1" | "2" | "finished"> {
  // Fetch the single GameStat document
  const gameStat = await GameStat.findOne();
  if (!gameStat) return "not_started";

  const now = new Date().getTime(); // numeric UTC timestamp
  const r1Start = gameStat.r1StartTime.getTime();
  const r1End = gameStat.r1EndTime.getTime();
  const r2Start = gameStat.r2StartTime?.getTime();
  const r2End = gameStat.r2EndTime?.getTime();

  if (now < r1Start) return "not_started";

  if (now >= r1Start && now <= r1End) return "1";

  if (r2Start && r2End && now >= r2Start && now <= r2End) return "2";

  return "finished";
}
