import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Initialize SendGrid client
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
  console.error('❌ Please add SENDGRID_API_KEY to your .env file');
} else {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid initialized successfully with API key');
  } catch (error) {
    console.error('❌ Failed to initialize SendGrid:', error.message);
  }
}

export default sgMail;