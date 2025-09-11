import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectToDatabase();
  return NextResponse.json({ message: "pong" }, { status: 200 });
}
