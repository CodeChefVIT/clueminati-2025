import User from '@/lib/models/user'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/db'

connectToDatabase()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json()
    const {email, password} = reqBody

    const user = await User.findOne({email})

    if(!user){
      return NextResponse.json({error:"User does not exist"},{status:400})
    }

    if(!user.isVerified) {
      return NextResponse.json({error:"Please verify your email before logging in"},{status:400})
    }

    const validPassword = await bcryptjs.compare(password,user.password)
    if(!validPassword){
      return NextResponse.json({error:"Check your credentials"},{status:400})
    }

    const tokenData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      teamId: user.teamId ?? null,
      region: user.region ?? null
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

    // prepare response
    const responsePayload: any = {
      message: "Logged in successfully",
      jwt: token,
      success: true,
    }

    // Special check for participants
    if(user.role === "participant" && !user.teamId){
      responsePayload.message = "Logged in succesfully but team not selected"
      responsePayload.redirect = "/team-selection"
    }

    const response = NextResponse.json(responsePayload)

    // set cookie
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

  } catch (error:any) {
    return NextResponse.json({error:error.message},{status:500}) 
  }
}
