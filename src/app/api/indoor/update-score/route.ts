import { connectToDatabase } from "@/lib/db";
import Team from "@/lib/models/team";
import User from "@/lib/models/user";
import { getCurrentRound } from "@/utils/getRound";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const tUser = await getUserFromToken(req);
        if(!tUser){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findById(tUser.id);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if(!user.teamId){
            return NextResponse.json({ error: "You are not part of any team" }, { status: 400 });
        }
        const team = await Team.findById(user.teamId);

        const reqBody = await req.json();
        const { indoorScore } = reqBody;

        const currentRound = await getCurrentRound();
        if(currentRound === "not_started"){
            return NextResponse.json({ error: "Game has not started"}, { status: 403 });
        }
        if(currentRound === "finished"){
            return NextResponse.json({ error: "Game has ended"}, { status: 403 });
        }

        if(currentRound === "1"){
            if(team!.round1!.indoor_score === 0){
                team!.round1!.indoor_score = +indoorScore;
                await team!.save();
                return NextResponse.json({ message: "The score for round 1 has been Updated" }, { status: 200 });
            }
            return NextResponse.json({ 
                error: "The Score for the indoor has already been updated in round 1" 
            }, { 
                status: 400 
            });
        }
        if(currentRound === "2"){
            if(team!.round2!.indoor_score === 0){
                team!.round2!.indoor_score = +indoorScore;
                await team!.save();
                //ma ki chu-
                let revealedString = "";
                if (team!.teamString && team!.teamString.length >= 6) {
                    revealedString = team!.teamString.substring(3, 6);
                }

                return NextResponse.json({ 
                    message: "The score for round 2 has been Updated",
                    revealedChars: revealedString
                }, { status: 200 });
            }
            return NextResponse.json({ 
                error: "The Score for the indoor has already been updated in round 2" 
            }, { 
                status: 400 
            })
        }

        return NextResponse.json({ error: "Current game state isn't defined properly" }, { status: 500 });
        

    } catch (error) {
        console.error("Error updating indoor score:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}