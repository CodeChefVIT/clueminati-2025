import { connectToDatabase } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/user'
import { RoleAssignmentSchema } from '@/lib/interfaces'

connectToDatabase()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const parsedBody = RoleAssignmentSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid request data", details: parsedBody.error.flatten() }, { status: 400 });
    }

    const { userId, teamId, gameRole } = parsedBody.data

    // Fetch current logged-in user (assume session logic here)
    const sessionUserId = reqBody.sessionUserId || null; // Replace with actual session retrieval
    if (!sessionUserId || sessionUserId !== userId) {
      return NextResponse.json({ error: "You can only assign a role to yourself" }, { status: 403 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gameRole, teamId },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Role assigned successfully",
      success: true,
      user: updatedUser
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
