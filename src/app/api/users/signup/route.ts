import {NextRequest, NextResponse} from 'next/server'     
import bcryptjs from 'bcryptjs'                     //importing bcryptjs for hashing passwords
import { sendEmail } from '@/lib/mailer'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/user'
import { UserSchema } from '@/lib/interfaces'
import crypto from 'crypto';

connectToDatabase()

export async function POST(request: NextRequest){   //took request as parameter for POST method
  try {                                                       /// try-catch block for error handling
    const reqBody = await request.json()   
    const parsed = UserSchema.parse(reqBody)        
    const {fullname, email, reg_num} = parsed     // destructuring json data to get fullname, email, password
    
    console.log("Starting signup process for:", email);      
    
    // Check if user already exists by email
    const existingUser = await User.findOne({email})

    if(existingUser){
      if(existingUser.isVerified) {
        return NextResponse.json({
          error: "user already exists",
          message: "This email is already registered. Please login or use a different email."
        }, {status: 400})
      }
    }

    const password = crypto.randomBytes(8).toString('hex');
    const salt = await bcryptjs.genSalt(10);     // hashing password for security
    const hashedPassword = await bcryptjs.hash(password,salt)     // hashed password

    const newUser = new User({        // creating new user object consisting of username, email, hashed password
      fullname,           
      email,
      reg_num,
      password:hashedPassword,
      isVerified: true
    })

    const savedUser = await newUser.save()                           // saving new user to db
    console.log(savedUser);        

    //send verification email
    await sendEmail({email, emailType: "VERIFY", userId: savedUser._id, password})     // sending email for verification

    console.log("Signup process completed for:", email);   

    return NextResponse.json({                                       // response if user is created successfully
      message: "User registered successfully",
      success: true,
      savedUser
    })

  } catch (error: unknown) {                                        // catch block to handle errors
    console.error("Signup error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';    // Type guard to extract error message
    return NextResponse.json({error: errorMessage}, {status: 500})          // 500 -> server error
  }
}
