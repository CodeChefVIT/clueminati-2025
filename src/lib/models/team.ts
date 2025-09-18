import { model, Schema, type Model, models } from "mongoose";
import { ITeam } from "../interfaces";

const TeamSchema = new Schema<ITeam>({
  teamname: { type: String, required: true, unique: true },
  joinCode: { type: String, unique: true },
  members: { type: [String], required: true, default: [] },
  round1: {
    questions_encountered: {
      easy: { type: [{ type: String, ref: "Questions" }], default: [] },
      medium: { type: [{ type: String, ref: "Questions" }], default: [] },
      hard: { type: [{ type: String, ref: "Questions" }], default: [] },
    },
    questions_solved: {
      easy: { type: [{ type: String, ref: "Questions" }], default: [] },
      medium: { type: [{ type: String, ref: "Questions" }], default: [] },
      hard: { type: [{ type: String, ref: "Questions" }], default: [] },
    },
    score: { type: Number, default: 0 },
    indoor_score: { type: Number, default: 0 },
    // testing skip - add skip tracking
    lastSkipTimestamp: { type: Date, required: false },
  },
  round2: {
    questions_encountered: {
      easy: { type: [{ type: String, ref: "Questions" }], default: [] },
      medium: { type: [{ type: String, ref: "Questions" }], default: [] },
      hard: { type: [{ type: String, ref: "Questions" }], default: [] },
    },
    questions_solved: {
      easy: { type: [{ type: String, ref: "Questions" }], default: [] },
      medium: { type: [{ type: String, ref: "Questions" }], default: [] },
      hard: { type: [{ type: String, ref: "Questions" }], default: [] },
    },
    score: { type: Number, default: 0 },
    indoor_score: { type: Number, default: 0 },
    path: { type: [String], required: false, default: [] },
    currentStation: { type: String, required: false },
    previousStation: { type: String, required: false },
    solvedStations: { type: [String], default: [] },
    secret_string: { type: String, required: false },
    secret_chars_revealed: { type: Number, default: 0 },
    letters_found: { type: [String], default: [] },
    // testing skip - add skip tracking
    lastSkipTimestamp: { type: Date, required: false },
  },
  total_score: { type: Number, default: 0, required: true },
});

const Team: Model<ITeam> = models.Team ?? model<ITeam>("Team", TeamSchema);

export default Team;
