import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/user'
import {NextRequest, NextResponse} from 'next/server'
//import { sendEmail } from '@/utils/mailer'

connectToDatabase()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json()
    const {token} = reqBody
    console.log(token);

    const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})

    if(!user){
      return NextResponse.json({error:"Invalid Token"},{status:400})
    }
    console.log(user);

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save()

    return NextResponse.json({message: "Email Verified Successfully",success: true},{status:200}) //////////////////////////

  } catch (error:any) {
    return NextResponse.json({error:error.message},{status:500})    
  }
}