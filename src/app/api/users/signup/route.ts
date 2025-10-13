import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/user';
import { UserSchema } from '@/lib/interfaces';
import crypto from 'crypto';
import { sendEmail2 } from '@/lib/mailer2';
import { sendEmail } from '@/lib/mailer';

connectToDatabase();


export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const parsed = UserSchema.parse(reqBody);
    const { fullname, email } = parsed;

    console.log('Starting signup process for:', email);

    if (!fullname || !email) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        {
          error: 'user already exists',
          message: 'This email is already registered. Please login or use a different email.',
        },
        { status: 400 }
      );
    }

    let randomBytes = crypto.randomBytes(8);
    const specialChars = "!@#$%^&*()_+~`|}{[]\:;?><,./-=";
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + specialChars;
      
    for (let i = 0; i < randomBytes.length; i++) {
        randomBytes[i] = allChars.charCodeAt(randomBytes[i] % allChars.length);
    }
    
    let password = randomBytes.toString('utf-8');


  
    // Hash password before saving to DB
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendEmail({ email, password });
    console.log('Signup process completed for:', email);

    return NextResponse.json({
      message: 'User registered successfully',
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
