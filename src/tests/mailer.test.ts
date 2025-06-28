import bcrypt from "bcryptjs";
import User from "@/models/userModel.js";
import nodemailer from "nodemailer";
import { sendMail } from "@/helpers/mailer";

//make mock dependencies for testing, testing the mailer without database or real email service
jest.mock("nodemailer");
jest.mock("bcryptjs");
jest.mock("@/models/userModel");
jest.mock("@/dbConfig/dbConfig", () => ({
  connectToDatabase: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedUser = User as jest.Mocked<typeof User>;
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe("sendMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedBcrypt.hash as jest.Mock).mockResolvedValue(
      "hashed-token-from-mock"
    );

    (mockedUser.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);

    const mockTransport = {
      sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
    };
    mockedNodemailer.createTransport.mockReturnValue(mockTransport as any);

    //Mock process.env variables
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "user@example.com";
    process.env.SMTP_PASS = "password";
    process.env.SENDER_EMAIL = "noreply@example.com";
    process.env.DOMAIN = "http://localhost:3000";
  });

  it("should send a verification email correctly", async () => {
    const options = {
      email: "test@example.com",
      emailType: "VERIFY" as const,
      userId: "user-id-123",
    };

    await sendMail(options);

    //Check that the user model was updated with the right token and expiry
    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(options.userId, {
      verifyToken: "hashed-token-from-mock",
      verifyTokenExpiry: expect.any(Date),
    });

    // Check that the nodemailer transport was created with the correct config
    expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get the mock sendMail function from the mock transport
    const sendMailMock = (mockedNodemailer.createTransport as jest.Mock).mock
      .results[0].value.sendMail;

    // Check that the email was sent with the correct options
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: options.email,
        subject: "Verify Email",
        html: expect.stringContaining(
          "verifyemail?token=hashed-token-from-mock"
        ),
      })
    );
  });

  it("should send a password reset email correctly", async () => {
    const options = {
      email: "reset@example.com",
      emailType: "REST" as const,
      userId: "user-id-456",
    };

    await sendMail(options);

    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(options.userId, {
      forgotpasswordToken: "hashed-token-from-mock",
      forgotpasswordTokenExpiry: expect.any(Date),
    });

    const sendMailMock = (mockedNodemailer.createTransport as jest.Mock).mock
      .results[0].value.sendMail;
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: options.email,
        subject: "Reset Password",
        html: expect.stringContaining(
          "resetpassword?token=hashed-token-from-mock"
        ),
      })
    );
  });

  it("should throw an error if updating the user model fails", async () => {
    const errorMessage = "Failed to update database";
    (mockedUser.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const options = {
      email: "fail@example.com",
      emailType: "VERIFY" as const,
      userId: "user-id-789",
    };
    await expect(sendMail(options)).rejects.toThrow(errorMessage);
  });
});
