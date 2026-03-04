import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  const message = {
    from: `"My App Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };
  return transport.sendMail(message);
};
