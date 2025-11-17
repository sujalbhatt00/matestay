import sgMail from '../config/sendgrid.js';

const VERIFIED_SENDER_EMAIL = process.env.EMAIL_USER;
const VERIFIED_SENDER_NAME = 'Matestay';

export const sendVerificationEmail = async (to, name, verificationUrl) => {
  const msg = {
    to,
    from: {
      email: VERIFIED_SENDER_EMAIL,
      name: VERIFIED_SENDER_NAME
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
    console.log('📧 Sending verification email via SendGrid to:', to);
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

export const sendPasswordResetEmail = async (to, name, resetLink) => {
  const msg = {
    to,
    from: {
      email: VERIFIED_SENDER_EMAIL,
      name: VERIFIED_SENDER_NAME
    },
    subject: 'Your Matestay Password Reset Request',
    text: `Hello ${name},\n\nYou requested a password reset for your Matestay account.\n\nPlease click the link below to set a new password:\n\n${resetLink}\n\nThis link is valid for 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe Matestay Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #5b5dda;">Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You requested a password reset for your <strong>Matestay</strong> account.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Please click the button below to set a new password. This link is valid for 15 minutes.</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #5b5dda; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Your Password</a>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #5b5dda; font-size: 12px;">${resetLink}</p>
        </div>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">
          This email was sent by Matestay. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    console.log('📧 Sending password reset email via SendGrid to:', to);
    await sgMail.send(msg);
    console.log('✅ Password reset email sent successfully via SendGrid');
  } catch (error) {
    console.error('❌ SendGrid reset email error:', error);
    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }
    throw error;
  }
};

export const sendPasswordChangeConfirmationEmail = async (to, name) => {
  const msg = {
    to,
    from: {
      email: VERIFIED_SENDER_EMAIL,
      name: VERIFIED_SENDER_NAME
    },
    subject: 'Your Matestay Password Has Been Changed',
    text: `Hello ${name},\n\nThis is a confirmation that the password for your Matestay account has been successfully changed.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Matestay Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #5b5dda;">Password Changed Successfully</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>This is a confirmation that the password for your <strong>Matestay</strong> account has been successfully changed.</p>
        <p style="color: #666; font-size: 12px;">If you did not make this change, please contact our support team immediately.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">
          This email was sent by Matestay. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    console.log('📧 Sending password change confirmation email via SendGrid to:', to);
    await sgMail.send(msg);
    console.log('✅ Password change confirmation sent successfully via SendGrid');
  } catch (error) {
    console.error('❌ SendGrid confirm change email error:', error);
    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }
    throw error;
  }
};