import { type Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  role: "participants" | "member" | "admin";
  username: string;
  email: string;
  password: string;
  teamId: string;
  region: "hell" | "earth";
}

export interface Istation {
  stationId: string;
  memberId: string;
  difficulty: "Easy" | "Midium" | "Hard";
}

export interface Iquestion {
  questionId: string;
  difficulty: "Easy" | "Midium" | "Hard";
  questionDescription: string;
  answerDescription: string;
  round: "1" | "2";
}

export interface IgameStat {
  eventState: "not_started" | "r1" | "r2" | "r3" | "Finished";
  r1StartTime: Date | null;
  r2StartTime: Date | null;
}

type QuestionSet = {
  easy: string[];
  midium: string[];
  hard: string[];
}

type roundDetails = {
    questionEncountered: QuestionSet;
    questionSolve: QuestionSet;
}

export interface Iteam {
  teamName: string;
  members: string[];
  path: string;
  secretString: string | null;
  score: number;
  r1: roundDetails;
  r2: roundDetails;
}
