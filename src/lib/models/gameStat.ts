import { model, Schema, type Model, models } from "mongoose";
import { IGameStat } from "../interfaces";

const gameStatSchema = new Schema<IGameStat>({
  r1StartTime: { type: Date, required: true },
  r1EndTime: { type: Date, required: true },
  r2StartTime: { type: Date, required: true },
  r2EndTime: { type: Date, required: true },
});

const GameStat: Model<IGameStat> =
  models.GameStat ?? model<IGameStat>("GameStat", gameStatSchema);

export default GameStat;
