import { model , Schema , type Model , models } from "mongoose";
import { IgameStat } from "@/interface";

const gameStatSchema = new Schema<IgameStat>({
    eventState:  { type: String, enum: ["not_started", "r1", "r2", "r3", "Finished"], required: true},
    r1StartTime: { type: Date, required: true},
    r2StartTime: { type: Date, required: true},
})


const GameStat: Model<IgameStat> =
  models.GameStat ?? model<IgameStat>("GameStat", gameStatSchema);

export default GameStat;