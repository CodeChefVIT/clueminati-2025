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
  
//working, last one hadissue
  const excludeStations = [];
  if (currentStation) excludeStations.push(currentStation);
  if (previousStation) excludeStations.push(previousStation);
  
  if (excludeStations.length > 0) {
    const excludeSet = new Set(excludeStations);
    candidateStations = allStations.filter((s) => !excludeSet.has(s._id.toString()));
  }

  if (candidateStations.length === 0) {
    return { error: "No alternative station available" };
  }

  const randomIndex = Math.floor(Math.random() * candidateStations.length);
  const nextStation = candidateStations[randomIndex];

  (team.round2 as any).previousStation = currentStation;
  team.round2.currentStation = nextStation._id.toString();
  await team.save();

  return {
    stationId: nextStation._id.toString(),
    station_name: nextStation.station_name,
    difficulty: (nextStation as any).difficulty,
  };
}


