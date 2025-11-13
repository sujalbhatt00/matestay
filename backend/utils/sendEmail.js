import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 Attempting to send email to:", to);
    console.log("📧 Using email credentials:", {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const mailOptions = {
      from: `"Matestay" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #5b5dda;">${subject}</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="white-space: pre-line; line-height: 1.6;">${text}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; text-align: center;">
            This email was sent by Matestay. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    console.log("📨 Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;