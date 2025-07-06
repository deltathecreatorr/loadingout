import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import nodemailer from "nodemailer";

connectToDatabase();

export async function sendMail({ email, emailType, userId }: any) {
  const hashedToken = await bcrypt.hash(userId.toString(), 10);

  const tokenExpiry = Date.now() + 3600000;

  try {
    if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotpasswordToken: hashedToken,
        forgotpasswordTokenExpiry: tokenExpiry,
      });
    } else if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: tokenExpiry,
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  const transport = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string, 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: emailType === "RESET" ? "Reset Password" : "Verify Email",
    html: `<p>Click <a href="http://localhost:3000/${
      emailType === "RESET" ? "resetpassword" : "verifyemail"
    }?token=${hashedToken}">here</a> to ${
      emailType === "RESET" ? "reset your password" : "verify your email"
    }</p>
               <p>http://localhost:3000/${
                 emailType === "RESET" ? "resetpassword" : "verifyemail"
               }?token=${hashedToken}</p>`,
  };

  const emailResponse = await transport.sendMail(mailOptions);
  return emailResponse;
}
