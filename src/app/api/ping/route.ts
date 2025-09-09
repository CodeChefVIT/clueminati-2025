import { connect } from "@/lib/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connect();
  return NextResponse.json({ message: "pong" }, { status: 200 });
}
