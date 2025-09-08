import { model , Schema , type Model , models } from "mongoose";
import { Istation } from "@/interface";

const stationSchema = new Schema<Istation>({
    stationId: { type: String, required: true, unique: true },
    memberId: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["Easy", "Midium", "Hard"], required: true},
})


const Station: Model<Istation> =
  models.Station ?? model<Istation>("Station", stationSchema);

export default Station;