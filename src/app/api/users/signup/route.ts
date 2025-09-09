import {connect} from '@/lib/dbConfig/dbConfig'
import User from '@/lib/models/user'
import {NextRequest, NextResponse} from 'next/server'     
import bcryptjs from 'bcryptjs'                     //importing bcryptjs for hashing passwords
import { sendEmail } from '@/lib/mailer'

connect()

export async function POST(request: NextRequest){   //took request as parameter for POST method
  try {                                                       /// try-catch block for error handling
    const reqBody = await request.json()            // extracting json data from request body
    const {fullname, email, password} = reqBody     // destructuring json data to get fullname, email, password
    
    console.log("Starting signup process for:", email);      
    
    // Input validation
    if (!fullname || !email || !password) {         // Check for missing fields
      console.log("Missing required fields");               
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({email})

    if(existingUser){
      if(existingUser.isVerified) {
        return NextResponse.json({
          error: "user already exists",
          message: "This email is already registered. Please login or use a different email."
        }, {status: 400})
      } else {
        return NextResponse.json({
          error: "user already exists",
          message: "This email is registered but not verified. Please check your email for verification link."
        }, {status: 400})
      }
    }

    const salt = await bcryptjs.genSalt(10);     // hashing password for security
    const hashedPassword = await bcryptjs.hash(password,salt)     // hashed password

    const newUser = new User({        // creating new user object consisting of username, email, hashed password
      fullname,           
      email,
      password:hashedPassword
    })

    const savedUser = await newUser.save()                           // saving new user to db
    console.log(savedUser);        

    //send verification email
    await sendEmail({email, emailType: "VERIFY",userId: savedUser._id})     // sending email for verification

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

