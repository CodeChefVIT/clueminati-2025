import nodemailer from "nodemailer";

interface SendEmailParams {
  email: string;
  password: string;
}

export const sendEmail = async ({ email, password }: SendEmailParams) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD ||
      !process.env.CLIENT_URL
    ) {
      throw new Error("Required environment variables are not set");
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: "CLUEMINATI ACCOUNT CREDENTIALS",
      html: `
        <p>The devil has decided to keep a record of all those who have fled hell or are captured.</p>
        <p>Sign in using this responsibly or the devil will be furious</p>
        <p>Here are your credentials</p>
        <p>Your email : <b>${email}</b></p>
        <p>Your password : <b>${password}</b></p>
        <p>Please keep it safe and <a href="${process.env.CLIENT_URL}/login">login to your account</a>.</p>
      `,
    };

    await transport.sendMail(mailOptions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while sending email");
  }
};
