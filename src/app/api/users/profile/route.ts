import User from '@/lib/models/user'
import Team from '@/lib/models/team'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/lib/getDataFromToken'
import { connectToDatabase } from '@/lib/db'

connectToDatabase()

export async function POST(request: NextRequest) {
  try {
    // extract data from token
    const userId = await getDataFromToken(request)

    // get user (excluding sensitive fields)
    const user = await User.findOne({ _id: userId })
      .select('-password -isVerified -verifyToken -verifyTokenExpiry')

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // fetch team details if user has a teamId
    let teamData = null
    if (user.teamId) {
      const team = await Team.findById(user.teamId).select('teamname joinCode')
      if (team) {
        teamData = {
          teamname: team.teamname,
          joinCode: team.joinCode,
          total_score: team.total_score
        }
      }
    }

    return NextResponse.json({
      message: 'User found',
      data: {
        user,
        team: teamData,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    )
  }
}
