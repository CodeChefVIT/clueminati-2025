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
    path: { type: [String], required: true, default: [] },
    currentStation: { type: String, required: false },
    solvedStations: { type: [String], default: [] },
    secretString: { type: String, required: true },
    lettersFound: { type: [String], default: [] },
    questionsSolved: { type: Number, default: 0 },
  },
  total_score: { type: Number, default: 0, required: true },
});

const Team: Model<ITeam> = models.Team ?? model<ITeam>("Team", TeamSchema);

export default Team;
