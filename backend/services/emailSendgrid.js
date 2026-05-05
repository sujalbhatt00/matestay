import sgMail from '../config/sendgrid.js';

const VERIFIED_SENDER_EMAIL = process.env.EMAIL_USER;
const VERIFIED_SENDER_NAME = 'Matestay';

export const sendVerificationEmail = async (to, name, verificationUrl) => {
  try {
    if (!VERIFIED_SENDER_EMAIL) {
      throw new Error('EMAIL_USER environment variable is not set');
    }

    const msg = {
      to: to,
      from: {
        email: VERIFIED_SENDER_EMAIL,
        name: VERIFIED_SENDER_NAME,
      },
      subject: 'Verify Your Email - Matestay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">Welcome to Matestay!</h2>
            <p style="color: #666; margin: 0;">Verify your email to get started</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering with <strong>Matestay</strong>!</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0;">Please verify your email by clicking the button below:</p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">Or copy and paste this link:</p>
              <p style="word-break: break-all; font-size: 11px; color: #999; margin: 8px 0 0 0;">${verificationUrl}</p>
            </div>
            
            <p style="color: #999; font-size: 12px;">This verification link will expire in 24 hours.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #999;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log(`📧 Sending verification email to: ${to}`);
    const response = await sgMail.send(msg);
    console.log(`✅ Verification email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error('❌ Verification Email Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.body || error.response?.data || error,
    });
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (to, name, resetLink) => {
  try {
    if (!VERIFIED_SENDER_EMAIL) {
      throw new Error('EMAIL_USER environment variable is not set');
    }

    const msg = {
      to: to,
      from: {
        email: VERIFIED_SENDER_EMAIL,
        name: VERIFIED_SENDER_NAME,
      },
      subject: 'Your Matestay Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">Password Reset</h2>
            <p style="color: #666; margin: 0;">Secure your account</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You requested a password reset for your Matestay account.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0;">Click below to reset your password. Valid for 15 minutes.</p>
              <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">Or copy this link:</p>
              <p style="word-break: break-all; font-size: 11px; color: #999; margin: 8px 0 0 0;">${resetLink}</p>
            </div>
            
            <p style="color: #d32f2f; font-size: 12px; font-weight: bold;">⚠️ If this wasn't you, ignore this email and your password won't be changed.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #999;">
            This email was sent by Matestay. Do not reply to this email.
          </p>
        </div>
      `,
    };

    console.log(`📧 Sending password reset email to: ${to}`);
    const response = await sgMail.send(msg);
    console.log(`✅ Password reset email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error('❌ Password Reset Email Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.body || error.response?.data || error,
    });
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

export const sendPasswordChangeConfirmationEmail = async (to, name) => {
  try {
    if (!VERIFIED_SENDER_EMAIL) {
      throw new Error('EMAIL_USER environment variable is not set');
    }

    const msg = {
      to: to,
      from: {
        email: VERIFIED_SENDER_EMAIL,
        name: VERIFIED_SENDER_NAME,
      },
      subject: 'Your Matestay Password Has Been Changed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">Password Updated</h2>
            <p style="color: #666; margin: 0;">Your account is secure</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your Matestay account password has been changed successfully.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666;">✅ If you made this change, no action is needed.</p>
              <p style="margin: 10px 0 0 0; color: #d32f2f; font-weight: bold;">⚠️ If you didn't make this change, <a href="${process.env.CLIENT_URL}/forgot-password" style="color: #2563eb;">reset your password immediately</a></p>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #999;">
            This email was sent by Matestay. Do not reply to this email.
          </p>
        </div>
      `,
    };

    console.log(`📧 Sending password change confirmation email to: ${to}`);
    const response = await sgMail.send(msg);
    console.log(`✅ Password change confirmation email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error('❌ Password Change Confirmation Email Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.body || error.response?.data || error,
    });
    throw new Error(`Failed to send password change confirmation email: ${error.message}`);
  }
};
