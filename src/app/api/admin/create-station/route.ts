import { getUserFromToken } from "@/app/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { StationSchema } from "@/lib/interfaces";
import Station from "@/lib/models/station";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    const body = await req.json();
    const parsed = StationSchema.parse(body);
    const newStation = await Station.create(parsed);
    return NextResponse.json(
      { message: "Station Created", data: newStation },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("error creating station", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
