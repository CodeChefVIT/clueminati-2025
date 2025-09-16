import User from '@/lib/models/user';
import nodemailer from 'nodemailer';

interface SendEmailParams {  
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string | any; // Support for MongoDB ObjectId
  password?: string;
}

export const sendEmail = async({email, emailType, userId, password}: SendEmailParams)=>{
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.CLIENT_URL) {
      throw new Error('Required environment variables are not set');
    }

    if(emailType === "RESET"){
      const hashedToken = (await import('bcryptjs')).hash(userId.toString(),10)
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
      html: emailType === "VERIFY" && password 
        ? `<p>Welcome to Clueminati! Your account has been created successfully.</p>
           <p>Your password is: <b>${password}</b></p>
           <p>Please keep it safe and <a href="${process.env.CLIENT_URL}/login">login to your account</a>.</p>`
        : `<p>Click <a href="${process.env.CLIENT_URL}/resetpassword?token=TOKEN_HERE">Here</a> to 
           ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy paste the link 
           below in your browser.<br>${process.env.CLIENT_URL}/resetpassword?token=TOKEN_HERE</p>`
    }

    await transport.sendMail(mailOptions)

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while sending email');
  }
}