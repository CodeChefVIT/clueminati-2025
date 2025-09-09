import { model , Schema , type Model , models } from "mongoose";
import { IQuestion } from "../interfaces";

const questionSchema = new Schema<IQuestion>({
    question_description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true},
    answer: { type: String, required: true },
    round: { type: String, enum: ["1", "2"], required: true},
})


const Question: Model<IQuestion> = models.Question ?? model<IQuestion>("Question", questionSchema);

export default Question;