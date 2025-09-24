import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/user';
import { UserSchema } from '@/lib/interfaces';
import crypto from 'crypto';
import { sendEmail2 } from '@/lib/mailer2';

connectToDatabase();


export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const parsed = UserSchema.parse(reqBody);
    const { fullname, reg_num, email } = parsed;

    console.log('Starting signup process for:', email);

    if (!fullname || !email || !reg_num) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const existingRegno = await User.findOne({ reg_num });
    if (existingRegno) {
      return NextResponse.json(
        {
          error: 'registration number exists',
          message: 'This Registration Number is already registered.',
        },
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

    const password = crypto.randomBytes(8).toString('hex');

  
    // Hash password before saving to DB
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      reg_num,
      isVerified: true,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendEmail2({ email, password });
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
