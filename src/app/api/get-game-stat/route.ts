import { NextResponse } from "next/server";
import GameStat from "@/lib/models/gameStat";
import { connectToDatabase } from "@/lib/db";

connectToDatabase()
export async function GET() {
  const gameStat = await GameStat.findOne();
  return NextResponse.json(gameStat);
}