import { model , Schema , type Model , models } from "mongoose";
import { Iteam } from "@/interface";

const TeamSchema = new Schema<Iteam>({
    teamName: { type: String, required: true, unique: true },
    members: { type: [String], required: true, unique: true },
    path: { type: String, required: true, unique: true },
    secretString: { type: String || null, required: true, unique: true },
    score: { type: Number, required: true, unique: true },
    r1: {
        questionEncountered: {
            easy: [{type: String, ref: "Questions"}],
            midium: [{type: String, ref: "Questions"}],
            hard: [{type: String, ref: "Questions"}],
        },
        questionSolve: {
            easy: [{type: String, ref: "Questions"}],
            midium: [{type: String, ref: "Questions"}],
            hard: [{type: String, ref: "Questions"}],
        },
    },
    r2: {
        questionEncountered: {
            easy: [{type: String, ref: "Questions"}],
            midium: [{type: String, ref: "Questions"}],
            hard: [{type: String, ref: "Questions"}],
        },
        questionSolve: {
            easy: [{type: String, ref: "Questions"}],
            midium: [{type: String, ref: "Questions"}],
            hard: [{type: String, ref: "Questions"}],
        },
    },
})


const Team: Model<Iteam> =
  models.Team ?? model<Iteam>("Team", TeamSchema);

export default Team;