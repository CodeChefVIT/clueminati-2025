import { model , Schema , type Model , models } from "mongoose";
import { IStation } from "../interfaces";

const stationSchema = new Schema<IStation>({
    station_name: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: [], required: false},
})


const Station: Model<IStation> =
  models.Station ?? model<IStation>("Station", stationSchema);

export default Station;