import { z } from 'zod';

export const UserSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'core_member', 'participant']).default('participant'),
  region: z.enum(['hell', 'earth']).optional(),
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
  game_score: z.number().min(0).default(0),
});

const Round2Schema = Round1Schema.extend({
  secret_string: z.string().optional().default(''),
  path: z.array(z.string()).default([]), // stationId[]
});

export const TeamSchema = z.object({
  teamname: z.string().min(1, 'Team name is required'),
  joinCode: z.string().optional(),
  members: z.array(z.string()).default([]), // userId[]
  round1: Round1Schema.optional(),
  round2: Round2Schema.optional(),
  total_score: z.number().min(0).default(0),
});

export const QuestionSchema = z.object({
  question_description: z.string(),
  answer: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  round: z.enum(['1', '2']),
});

export const StationSchema = z.object({
  station_name: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  members: z.array(z.string()).default([]), // userId[]
});

export const GameStatSchema = z.object({
  r1StartTime: z.string().transform((val) => new Date(val)),
  r1EndTime: z.string().transform((val) => new Date(val)),
  r2StartTime: z.string().transform((val) => new Date(val)),
  r2EndTime: z.string().transform((val) => new Date(val)),
});
export const RoundSchema = z
  .object({
    roundNumber: z.number().int().nonnegative(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
  });

export const EventSchema = z.object({
  name: z.string().default('Clueminati'),
  rounds: z.array(RoundSchema).min(1),
  currentRound: z.number().int().nonnegative().default(0),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ValidateQuestionSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});

export type IValidateQuestion = z.infer<typeof ValidateQuestionSchema>;
export type IEvent = z.infer<typeof EventSchema>;
export type IUser = z.infer<typeof UserSchema>;
export type ITeam = z.infer<typeof TeamSchema>;
export type IQuestion = z.infer<typeof QuestionSchema>;
export type IStation = z.infer<typeof StationSchema>;
export type IGameStat = z.infer<typeof GameStatSchema>;
