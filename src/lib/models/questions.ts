import { model , Schema , type Model , models } from "mongoose";
import { Iquestion } from "@/interface";

const questionsSchema = new Schema<Iquestion>({
    questionId: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["Easy", "Midium", "Hard"], required: true},
    questionDescription: { type: String, required: true },
    answerDescription: { type: String, required: true },
    round: { type: String, enum: ["1", "2"], required: true},
})


const Questions: Model<Iquestion> =
  models.Questions ?? model<Iquestion>("Questions", questionsSchema);

export default Questions;