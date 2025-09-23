import Team from "@/lib/models/team";
import { getAllStations } from "@/utils/getAllStations";
//using utility function, hence the changes 

type AssignNextStationResult =
  | {
      stationId: string;
      station_name: string;
      difficulty?: string;
    }
  | { error: string };

export async function assignNextStation(teamId: string): Promise<AssignNextStationResult> {
  const team = await Team.findById(teamId);
  if (!team || !team.round2) {
    return { error: "Team not found or round2 not started" };
  }

  const currentStation: string | null = team.round2.currentStation ?? null;
  const previousStation: string | null = (team.round2 as any)?.previousStation ?? null;

  const allStations = await getAllStations();
  if (!allStations || allStations.length === 0) {
    return { error: "No stations available" };
  }

  let candidateStations = allStations;
  if (currentStation && previousStation && allStations.length > 2) {
    const exclude = new Set([currentStation, previousStation]);
    candidateStations = allStations.filter((s) => !exclude.has(s.id));
  } else if (currentStation) {
    candidateStations = allStations.filter((s) => s.id !== currentStation);
  }

  if (candidateStations.length === 0) {
    return { error: "No alternative station available" };
  }

  const randomIndex = Math.floor(Math.random() * candidateStations.length);
  const nextStation = candidateStations[randomIndex];

  (team.round2 as any).previousStation = currentStation ?? null;
  team.round2.currentStation = nextStation.id;
  await team.save();

  return {
    stationId: nextStation.id,
    station_name: nextStation.name,
    difficulty: nextStation.difficulty,
  };
}


