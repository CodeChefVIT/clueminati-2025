import Station from "@/lib/models/station";
import { connectToDatabase } from "@/lib/db";

export async function getAllStations() {
  await connectToDatabase();
  
  const stations = await Station.find({});
  
  return stations.map(station => ({
    id: station._id.toString(),
    name: station.station_name,
    difficulty: station.difficulty || "Not specified",
    members: station.members || []
  }));
}