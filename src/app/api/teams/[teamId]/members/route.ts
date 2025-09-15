import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import User from "@/lib/models/user";

connectToDatabase();

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ teamId: string }> } // 👈 Make sure this matches how Next.js passes params
) {
  try {
    const { teamId } = await context.params; // ✅ await the params
    console.log("Fetching members for team:", teamId);

    const team = await Team.findById(teamId).populate("members", "fullname _id");

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // 👇 Confirm team.members is an array before mapping
    if (!Array.isArray(team.members)) {
      return NextResponse.json({ error: "Team members not found" }, { status: 500 });
    }

    const members = team.members.map((member: any) => ({
      userId: member?._id?.toString() ?? "unknown",
      name: member?.fullname ?? "Unnamed",
    }));

    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
