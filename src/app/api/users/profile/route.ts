import User from '@/lib/models/user'
import Team from '@/lib/models/team'
import Station from '@/lib/models/station'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/lib/getDataFromToken'
import { connectToDatabase } from '@/lib/db'

connectToDatabase()

export async function GET(request: NextRequest) {
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
      const team = await Team.findById(user.teamId)
      if (team) {
        const station = await Station.findById(team.round2?.currentStation)

        teamData = {
          teamname: team.teamname,
          teamId: team._id,
          joinCode: team.joinCode,
          total_score: team.total_score,
          currentStationName: station?.station_name || null,
          currentStationId: team.round2?.currentStation || null
        }
      }
    }

    //Ayman 6:30
    // fetch station details if user is core member with allocated station
    let stationData = null
    if (user.role === "core_member" && user.core_allocated_station) {
      const station = await Station.findById(user.core_allocated_station)
      if (station) {
        stationData = {
          id: station._id.toString(),
          name: station.station_name,
          difficulty: station.difficulty || "Not specified"
        }
      }
    }

    return NextResponse.json({
      message: 'User found',
      data: {
        user,
        team: teamData,
        station: stationData
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    )
  }
}
