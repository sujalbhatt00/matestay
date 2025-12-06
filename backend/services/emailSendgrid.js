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
          <a href="${verificationUrl}" style="display: inline-block; background-color: #5b5dda; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p style="margin-top: 15px; font-size: 12px;">Or copy and paste this link:</p>
          <p style="word-break: break-all; font-size: 12px;">${verificationUrl}</p>
        </div>
        <p style="font-size: 12px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center;">
          This email was sent by Matestay.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
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
    text: `Hello ${name},\n\nYou requested a password reset.\n\nReset link:\n${resetLink}\n\nValid for 15 minutes.\n\nIf this wasn't you, ignore this email.\n\nMatestay Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #5b5dda;">Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You requested a password reset for your Matestay account.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Click below to reset your password. Valid for 15 minutes.</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #5b5dda; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 15px; font-size: 12px;">Or copy this link:</p>
          <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
        </div>
        <p style="font-size: 12px;">If this wasn't you, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center;">This email was sent by Matestay.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
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
    text: `Hello ${name},\n\nYour Matestay account password has been changed.\n\nIf this wasn't you, contact support immediately.\n\nMatestay Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #5b5dda;">Password Changed</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your Matestay account password has been changed.</p>
        <p style="font-size: 12px;">If this wasn't you, contact support immediately.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center;">This email was sent by Matestay.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};
