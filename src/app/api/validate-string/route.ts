import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/lib/getDataFromToken'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/user'
import Team from '@/lib/models/team'

connectToDatabase()

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request)
    
    //user object
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    //iss check ko remove kardoon kya?
    if (!user.teamId) {
      return NextResponse.json(
        { message: 'User is not part of any team' },
        { status: 400 }
      )
    }

    // Get the user input from request body
    const { inputString } = await request.json()

    if (!inputString) {
      return NextResponse.json(
        { message: 'Input string is required' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z]{6}$/.test(inputString)) {
      return NextResponse.json(
        { message: 'Input must be exactly 6 characters' },
        { status: 400 }
      )
    }

    const team = await Team.findById(user.teamId)
    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' }, 
        { status: 404 }
      )
    }

    if (!team.teamString) {
      return NextResponse.json(
        { message: 'Team string not assigned yet' },
        { status: 400 }
      )
    }

    if (team.stringValidated) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Your team has already validated the string successfully. This can only be done once per team.'
        },
        { status: 400 }
      )
    }

    const isMatch = inputString.toLowerCase() === team.teamString.toLowerCase()

    if (isMatch) {
      const stringScore = 70; 
      
      team.stringValidated = true;
      team.total_score += stringScore;
      
      await team.save();

      return NextResponse.json({
        success: true,
        message: 'Congratulations! String validation successful! Your team has been awarded points.',
        data: {
          teamString: team.teamString,
          inputString: inputString,
          pointsAwarded: stringScore,
          newTotalScore: team.total_score
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'String validation failed. The entered code does not match your team string.',
        data: {
          inputString: inputString
        }
      })
    }
  } catch (error: any) {
    console.error('Error in validate-string route:', error)
    return NextResponse.json(
      { message: 'An internal server error occurred.', details: error.message },
      { status: 500 }
    )
  }
}