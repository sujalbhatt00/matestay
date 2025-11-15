import sgMail from '../config/sendgrid.js';

export const sendVerificationEmail = async (to, name, verificationUrl) => {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL_USER,
      name: 'Matestay'
    },
    subject: 'Verify Your Email - Matestay',
    text: `Hello ${name},\n\nThank you for registering with Matestay!\n\nPlease verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Matestay Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #5b5dda;">Verify Your Email</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for registering with <strong>Matestay</strong>!</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Please verify your email by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #5b5dda; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Verify Email</a>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #5b5dda; font-size: 12px;">${verificationUrl}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">
          This email was sent by Matestay. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    console.log('📧 Sending email via SendGrid to:', to);
    await sgMail.send(msg);
    console.log('✅ Email sent successfully via SendGrid');
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }
    throw error;
  }
};