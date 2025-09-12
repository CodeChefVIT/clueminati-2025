import User from '@/lib/models/user';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

interface SendEmailParams {  
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string | any; // Support for MongoDB ObjectId
}

export const sendEmail = async({email, emailType, userId}: SendEmailParams)=>{
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.CLIENT_URL) {
      throw new Error('Required environment variables are not set');
    }
    const hashedToken = await bcryptjs.hash(userId.toString(),10)

    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}) //1hr
    } else if(emailType === "RESET"){
      await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}) //1hr
    }

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.CLIENT_URL}/verifyemail?token=${hashedToken}">Here</a> to 
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy paste the link 
      below in your browser.<br>${process.env.CLIENT_URL}/verifyemail?token=${hashedToken}</p>`
    }

    await transport.sendMail(mailOptions)

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while sending email');
  }
}