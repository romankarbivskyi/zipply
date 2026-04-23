import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
  url: string;
}) {
  await mailer.sendMail({
    from: `"Zipply" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9fb; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Zipply</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="margin-top: 0; color: #1a1a1a; font-size: 20px;">Welcome aboard, ${user.name || "there"}! 👋</h2>
            <p style="color: #4a4a55; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thanks for joining Zipply. We're thrilled to have you! To start shortening links and tracking your analytics, we just need to verify your email address.
            </p>
            
            <a href="${url}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; text-align: center;">
              Verify Email Address
            </a>
            
            <p style="color: #888893; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eeeef0;">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${url}" style="color: #4a4a55; text-decoration: underline; word-break: break-all;">${url}</a>
            </p>
          </div>
          
          <div style="background-color: #f9f9fb; padding: 20px; text-align: center; border-top: 1px solid #eeeef0;">
            <p style="color: #888893; font-size: 13px; margin: 0;">
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>
          
        </div>
      </div>
    `,
  });
}
