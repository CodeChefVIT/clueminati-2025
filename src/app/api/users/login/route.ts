 
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
    // validation
    console.log(reqBody);

    const user = await User.findOne({email})

    if(!user){
      return NextResponse.json({error:"User does not exist"},{status:400})
    }

    if(!user.isVerified) {
      return NextResponse.json({error:"Please verify your email before logging in"},{status:400})
    }

    console.log("User exists and is verified");

    const validPassword = await bcryptjs.compare(password,user.password)

    if(!validPassword){
      return NextResponse.json({error:"Check your credentials"},{status:400})
    }

    const tokenData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email      //payload, more the data on the token, more the bandwidth
    }

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

    const response = NextResponse.json({
      message: "Logged in successfully",
      jwt: token, //for gamedev integration
      success: true
    });

    // Set cookie separately
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 1 day
    });

    return response

  } catch (error:any) {
    return NextResponse.json({error:error.message},{status:500}) 
  }

}