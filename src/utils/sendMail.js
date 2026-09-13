import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
  {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  {
    from: process.env.SMTP_FROM,
  },
);

export const sendEmail = async ({ from, to, subject, html }) => {
  return transporter.sendMail({
    ...(from ? { from } : {}),
    to,
    subject,
    html,
  });
};
