import User from '@/lib/models/user'
import {NextRequest, NextResponse} from 'next/server'
import { getDataFromToken } from '@/lib/getDataFromToken'
import { connectToDatabase } from '@/lib/db'

connectToDatabase()

export async function POST(request: NextRequest){
  //extract data from token
  const userId = await getDataFromToken(request)
  const user = await User.findOne({_id: userId}).select("-password") //excludes password field
  //check if user exists
  return NextResponse.json({
    message:"User found",
    data: user
  })
}