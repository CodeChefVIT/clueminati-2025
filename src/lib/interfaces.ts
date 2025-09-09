import { z } from "zod";

export const UserSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "core_member", "participant"]).default("participant"),
  region: z.enum(["indoor", "outdoor"]).optional(),
  teamId: z.string().optional(),
  isVerified: z.boolean().default(false),
  verifyToken: z.string().optional(),
  verifyTokenExpiry: z.date().optional(),
  forgotPasswordToken: z.string().optional(),
  forgotPasswordTokenExpiry: z.date().optional(),
});

const QuestionTrackingSchema = z.object({
  easy: z.array(z.string()).default([]), // questionId[]
  medium: z.array(z.string()).default([]),
  hard: z.array(z.string()).default([]),
});

const Round1Schema = z.object({
  questions_solved: QuestionTrackingSchema,
  questions_encountered: QuestionTrackingSchema,
  score: z.number().min(0).default(0),
});

const Round2Schema = Round1Schema.extend({
  secret_string: z.string().optional(),
  path: z.array(z.string()).default([]), // stationId[]
});

export const TeamSchema = z.object({
  teamname: z.string().min(1, "Team name is required"),
  members: z.array(z.string()).default([]), // userId[]
  round1: Round1Schema,
  round2: Round2Schema,
  total_score: z.number().min(0).default(0),
});

export const QuestionSchema = z.object({
  question_description: z.string(),
  answer: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  round: z.enum(["1", "2"]),
});

export const StationSchema = z.object({
  station_name: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  members: z.array(z.string()).default([]), // userId[]
});

export type IUser = z.infer<typeof UserSchema>;
export type ITeam = z.infer<typeof TeamSchema>;
export type IQuestion = z.infer<typeof QuestionSchema>;
export type IStation = z.infer<typeof StationSchema>;

