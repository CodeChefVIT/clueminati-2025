import { getUserFromToken } from '@/utils/getUserFromToken';
import { connectToDatabase } from '@/lib/db';
import { getCurrentRound } from '@/utils/getRound';
import Team from '@/lib/models/team';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/user';
import { z } from 'zod';

connectToDatabase();

const ValidateStringSchema = z.object({
  guessedString: z.string().min(1).max(6, "String cannot be longer than 6 characters")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ValidateStringSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { guessedString } = parsed.data;

    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ _id: tUser.id }).select(
      '-password -isVerified -verifyToken -verifyTokenExpiry'
    );

    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'User not found or not in a team' }, { status: 404 });
    }

    const currentRound = await getCurrentRound();
    
    // Allow validation only after Round 2 ends (when game is "finished")
    if (currentRound !== "finished") {
      return NextResponse.json(
        { error: 'String validation is only available after Round 2 ends' },
        { status: 400 }
      );
    }

    const team = await Team.findById(user.teamId);
    if (!team || !team.round2) {
      return NextResponse.json({ error: 'Team not found or Round 2 data missing' }, { status: 404 });
    }

    if (!team.round2.secret_string) {
      return NextResponse.json({ error: 'No secret string assigned to team' }, { status: 400 });
    }

    // Check if team has already validated their string
    if (team.round2.string_validated) {
      return NextResponse.json(
        { 
          message: 'String already validated',
          previousScore: team.round2.string_score || 0,
          correctString: team.round2.secret_string
        },
        { status: 200 }
      );
    }

    const secretString = team.round2.secret_string.toUpperCase();
    const guessedStringUpper = guessedString.toUpperCase();
    
    // Count correct characters in correct positions
    let correctChars = 0;
    const maxLength = Math.min(secretString.length, guessedStringUpper.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (secretString[i] === guessedStringUpper[i]) {
        correctChars++;
      }
    }

    // Calculate points: 16 points per correct character
    const pointsEarned = correctChars * 16;
    
    // Check if it's a perfect match
    const isPerfectMatch = correctChars === 6 && guessedStringUpper === secretString;

    // Update team scores
    team.round2.string_score = pointsEarned;
    team.round2.string_validated = true;
    team.round2.guessed_string = guessedStringUpper;
    team.round2.score += pointsEarned;
    team.total_score += pointsEarned;

    await team.save();

    const response = {
      success: true,
      message: isPerfectMatch ? 'String accepted' : 'Partial match',
      correctChars,
      pointsEarned,
      secretString,
      guessedString: guessedStringUpper,
      isPerfectMatch,
      maxPossiblePoints: 96
    };

    return NextResponse.json(response, { status: 200 });

  } catch (e) {
    console.error('Error validating string:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check validation status
export async function GET(req: NextRequest) {
  try {
    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ _id: tUser.id }).select(
      '-password -isVerified -verifyToken -verifyTokenExpiry'
    );

    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'User not found or not in a team' }, { status: 404 });
    }

    const currentRound = await getCurrentRound();
    const team = await Team.findById(user.teamId);
    
    if (!team || !team.round2) {
      return NextResponse.json({ error: 'Team not found or Round 2 data missing' }, { status: 404 });
    }

    return NextResponse.json({
      currentRound,
      canValidate: currentRound === "finished",
      hasSecretString: !!team.round2.secret_string,
      alreadyValidated: !!team.round2.string_validated,
      secretCharsRevealed: team.round2.secret_chars_revealed || 0,
      lettersFound: team.round2.letters_found || [],
      stringScore: team.round2.string_score || 0
    });

  } catch (e) {
    console.error('Error checking validation status:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}