import { connectToDatabase } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/user'
import Team from '@/lib/models/team'
import { getUserFromToken } from '@/utils/getUserFromToken'
import { RegionSelectionSchema } from '@/lib/interfaces'
import jwt from 'jsonwebtoken'

connectToDatabase()

export async function POST(request: NextRequest) {
  try {
    const tUser = await getUserFromToken(request);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reqBody = await request.json()
    const parsedBody = RegionSelectionSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: parsedBody.error.flatten() 
      }, { status: 400 });
    }

    const { region } = parsedBody.data

    const user = await User.findById(tUser.id);
    if (!user || !user.teamId) {
      return NextResponse.json({ error: "User not found or not in a team" }, { status: 404 });
    }

    if (region === "hell") {
      const team = await Team.findById(user.teamId).populate('members');
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      //counting current hell region members excluding current user if already assigned
      const hellMembers = await User.countDocuments({
        teamId: user.teamId,
        region: "hell",
        _id: { $ne: user._id }
      });

      if (hellMembers >= 2) {
        return NextResponse.json({ 
          error: "Hell region is full. Maximum 2 members allowed in hell region per team." 
        }, { status: 400 });
      }
    }

    if (region === "earth") {
      const earthMembers = await User.countDocuments({
        teamId: user.teamId,
        region: "earth",
        _id: { $ne: user._id }
      });

      if (earthMembers >= 3) {
        return NextResponse.json({ 
          error: "Earth region is full. Maximum 3 members allowed in earth region per team." 
        }, { status: 400 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      tUser.id,
      { region },
      { new: true }
    ).select('-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry')

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const tokenData = {
      id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      role: updatedUser.role,
      teamId: updatedUser.teamId ?? null,
      region: updatedUser.region ?? null
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

    const response = NextResponse.json({
      message: "Region assigned successfully",
      success: true,
      user: updatedUser
    })

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400
    });

    return response

  } catch (error: any) {
    console.error('Error in region selection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
