import { connectToDatabase } from "@/lib/db";
import Station from "@/lib/models/station";

export interface StationOption {
  id: string;
  station_name: string;
  difficulty: string;
}

export async function getAllStations(): Promise<StationOption[]> {
  try {
    await connectToDatabase();
    
    const stations = await Station.find({}, 'station_name difficulty').lean();
    
    return stations.map(station => ({
      id: station._id.toString(),
      station_name: station.station_name,
      difficulty: station.difficulty || 'is this giving erRor?!',
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw new Error('Failed to fetch stations');
  }
}