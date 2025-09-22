import { getUserFromToken } from '@/utils/getUserFromToken';
import { normalizeAnswer } from '@/utils/normalizeAnswer';
import { connectToDatabase } from '@/lib/db';
import { ValidateQuestionSchema } from '@/lib/interfaces';
import { getCurrentRound } from '@/utils/getRound';
import Question from '@/lib/models/question';
import Team from '@/lib/models/team';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/user';
import { assignNextStation } from '@/utils/assignNextStation';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ValidateQuestionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { questionId, userAnswer } = parsed.data;

    const tUser = await getUserFromToken(req);
    if (!tUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ _id: tUser.id }).select(
      '-password -isVerified -verifyToken -verifyTokenExpiry'
    );
    console.log(user)
    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'User not found or not in a team' }, { status: 404 });
    }

    const currentRound = await getCurrentRound();
    if (currentRound === "not_started" || currentRound === "finished") {
      return NextResponse.json(
        { error: `Game is ${currentRound}` },
        { status: 400 }
      );
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const theQuestion = await Question.findById(questionId);
    if (!theQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    //validating question belongs to current round
    if (theQuestion.round !== currentRound) {
      return NextResponse.json(
        { error: `This question does not belong to Round ${currentRound}` },
        { status: 400 }
      );
    }

    const difficulty = theQuestion.difficulty;
    const roundKey = currentRound === "1" ? "round1" : "round2";

    if (!team[roundKey]) {
      return NextResponse.json({ error: `Team is not participating in Round ${currentRound}` }, { status: 400 });
    }

    if (team[roundKey]?.questions_solved[difficulty].includes(questionId)) {
      return NextResponse.json(
        { message: 'Question already solved' },
        { status: 200 }
      );
    }

    //checking answer correctness
    const isCorrect =
      normalizeAnswer(userAnswer as string) ===
      normalizeAnswer(theQuestion.answer as string);

    if (!isCorrect) {
      return NextResponse.json({ message: 'incorrect' }, { status: 200 });
    }

    //updating team progress on correct answer
    const points =
      difficulty === 'easy' ? 10 : 
      difficulty === 'medium' ? 40 : 
      70;

    if (team[roundKey]) {
      team[roundKey]!.questions_solved[difficulty].push(questionId);
      team[roundKey]!.score += points;
    }
    team.total_score += points;

    //round 2 specific logic for secret character reveal and station management
    let revealChar: string | null = null;
    let nextStation: any = null;

    if (currentRound === "2" && team.round2) {
      // Calculate total AFTER adding current question
      const totalSolved = Object.values(team.round2.questions_solved).flat().length;
      const revealSteps = [3, 5, 7];

      console.log(`Round 2 Debug: Total solved: ${totalSolved}, Reveal steps: [${revealSteps}]`);

      if (revealSteps.includes(totalSolved)) {
        console.log(`🔤 Revealing random character from secret string "${team.round2.secret_string}"`);
        
        if (team.round2.secret_string && team.round2.secret_string.length > 0) {
          // Initialize letters_found array if not exists //debugged error
          if (!team.round2.letters_found) {
            team.round2.letters_found = [];
          }

          const secretChars = [...team.round2.secret_string];
          const unrevealedPositions = secretChars
            .map((char, index) => ({ char, index }))
            .filter(({ char, index }) => 
              !team.round2!.letters_found?.some(found => found === `${char}_${index}`)
            );

          if (unrevealedPositions.length > 0) {
            const randomPosition = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)];
            const { char: randomChar, index: charIndex } = randomPosition;
            
            revealChar = randomChar;
            
            // store with its posn to avoid duplicates
            team.round2.letters_found.push(`${randomChar}_${charIndex}`);
            team.round2.secret_chars_revealed = (team.round2.secret_chars_revealed || 0) + 1;
            
            console.log(`Random character revealed: "${revealChar}" (position ${charIndex}), Total revealed: ${team.round2.secret_chars_revealed}`);
          } else {
            console.log(`All characters already revealed`);
          }
        }
      }

      if (team.round2.currentStation && !team.round2.solvedStations.includes(team.round2.currentStation)) {
        team.round2.solvedStations.push(team.round2.currentStation);
        console.log(`Station completed: ${team.round2.currentStation}`);
      }

      try {
        const stationResult = await assignNextStation(user.teamId);
        if ('error' in stationResult) {
          console.warn('Station assignment failed:', stationResult.error);
        } else {
          nextStation = stationResult;
          console.log(`Next station assigned: ${nextStation.station_name} (${nextStation.stationId})`);
        }
      } catch (stationError) {
        console.error('Error assigning next station:', stationError);
      }
    }

    await team.save();

    const response = {
      message: 'correct',
      data: theQuestion,
      round: currentRound,
      ...(revealChar ? { reveal: revealChar } : {}),
      ...(nextStation ? { nextStation } : {})
    };

    return NextResponse.json(response, { status: 200 });

  } catch (e) {
    console.error('Error validating question:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
