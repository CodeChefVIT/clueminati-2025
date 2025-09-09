import { model , Schema , type Model , models } from "mongoose";
import { IGameStat } from "../interfaces";

const gameStatSchema = new Schema<IGameStat>({
    eventState:  { type: String, enum: ["not_started", "r1", "r2", "r3", "Finished"], required: true},
    r1StartTime: { type: Date, required: true},
    r2StartTime: { type: Date, required: true},
})


const GameStat: Model<IGameStat> =
  models.GameStat ?? model<IGameStat>("GameStat", gameStatSchema);

export default GameStat;