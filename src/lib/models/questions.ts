import { model , Schema , type Model , models } from "mongoose";
import { IQuestion } from "../interfaces";

const questionsSchema = new Schema<IQuestion>({
    question_description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Midium", "Hard"], required: true},
    answer: { type: String, required: true },
    round: { type: String, enum: ["1", "2"], required: true},
})


const Questions: Model<IQuestion> = models.Questions ?? model<IQuestion>("Questions", questionsSchema);

export default Questions;