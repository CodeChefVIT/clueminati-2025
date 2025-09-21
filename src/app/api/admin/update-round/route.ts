import { getUserFromToken } from "@/utils/getUserFromToken";
import { connectToDatabase } from "@/lib/db";
import { GameStatSchema } from "@/lib/interfaces";
import GameStat from "@/lib/models/gameStat";
import User from "@/lib/models/user";
import { autoAssignSecretStrings } from "@/utils/autoAssignSecretStrings";
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
    const parsed = GameStatSchema.parse(body);

    const existing = await GameStat.findOne();
    const previousGameStat = existing ? { ...existing.toObject() } : null;

    if (existing) {
      Object.assign(existing, parsed); 
      await existing.save();

      // Check if Round 2 just started
      const now = new Date().getTime();
      const r2Start = existing.r2StartTime?.getTime();
      const wasRound2Starting = r2Start && now >= r2Start;
      
      // If Round 2 started and we have different times, auto-assign secret strings
      const previousR2Start = previousGameStat?.r2StartTime?.getTime();
      const isNewRound2Start = r2Start && (!previousR2Start || r2Start !== previousR2Start);
      
      if (isNewRound2Start) {
        try {
          console.log("🚀 Round 2 starting - auto-assigning secret strings...");
          const result = await autoAssignSecretStrings();
          console.log(`✅ Assigned secret strings to ${result.assignedCount} teams`);
          
          return NextResponse.json(
            { 
              message: "Game updated successfully and secret strings assigned", 
              data: existing,
              secretStringsAssigned: result.assignedCount
            },
            { status: 200 }
          );
        } catch (error) {
          console.error("Failed to auto-assign secret strings:", error);
          // Still return success for game update, but log the error
          return NextResponse.json(
            { 
              message: "Game updated successfully but failed to assign secret strings", 
              data: existing,
              error: "Secret string assignment failed"
            },
            { status: 200 }
          );
        }
      }

      return NextResponse.json(
        { message: "Game updated successfully", data: existing },
        { status: 200 }
      );
    }

    const newGame = await GameStat.create(parsed);
    return NextResponse.json(
      { message: "Game created successfully", data: newGame },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.message },
        { status: 400 }
      );
    }
    console.error("Error creating/updating game", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
