import Team from "@/lib/models/team";
import Station from "@/lib/models/station";

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

  const allStations = await Station.find({});
  if (!allStations || allStations.length === 0) {
    return { error: "No stations available" };
  }

  let candidateStations = allStations;
  if (currentStation && previousStation && allStations.length > 2) {
    const exclude = new Set([currentStation, previousStation]);
    candidateStations = allStations.filter((s) => !exclude.has(s._id.toString()));
  } else if (currentStation) {
    candidateStations = allStations.filter((s) => s._id.toString() !== currentStation);
  }

  if (candidateStations.length === 0) {
    return { error: "No alternative station available" };
  }

  const randomIndex = Math.floor(Math.random() * candidateStations.length);
  const nextStation = candidateStations[randomIndex];

  (team.round2 as any).previousStation = currentStation ?? null;
  team.round2.currentStation = nextStation._id.toString();
  await team.save();

  return {
    stationId: nextStation._id.toString(),
    station_name: nextStation.station_name,
    difficulty: (nextStation as any).difficulty,
  };
}


