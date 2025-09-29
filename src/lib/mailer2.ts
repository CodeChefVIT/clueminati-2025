import nodemailer from "nodemailer";

interface SendEmailParams {
  email: string;
  password: string;
}

const senders = [
  // { user: process.env.EMAIL_USER1, pass: process.env.EMAIL_PASSWORD1 },
  { user: process.env.EMAIL_USER2, pass: process.env.EMAIL_PASSWORD2 },
  // { user: process.env.EMAIL_USER3, pass: process.env.EMAIL_PASSWORD3 },
];

export const sendEmail2 = async ({ email, password }: SendEmailParams) => {
  try {
    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL env variable not set");
    }

    const sender = senders[Math.floor(Math.random() * senders.length)];

    if (!sender.user || !sender.pass) {
      throw new Error("Missing sender credentials in env");
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender.user,
        pass: sender.pass,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
    });

    const mailOptions = {
      from: sender.user,
      to: email,
      subject: "CLUEMINATI ACCOUNT CREDENTIALS",
      html: `
        <p>The devil has decided to keep a record of all those who have fled hell or are captured.</p>
        <p>Sign in using this responsibly or the devil will be furious</p>
        <p>Here are your credentials</p>
        <p>Your email : <b>${email}</b></p>
        <p>Your password : <b>${password}</b></p>
        <p>KEEP IT SAFE</p>
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
