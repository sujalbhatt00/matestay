# Brevo Email Setup Guide for Matestay

## ✅ What's Been Configured

Your backend is now fully set up to use **Brevo** for email authentication with the following endpoints:

### **Auth Endpoints Available**
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/verify-email?token=VERIFICATION_TOKEN` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `POST /api/auth/google` - Google OAuth login (already working)

---

## 🚀 Step-by-Step Setup

### **Step 1: Get Brevo API Key**

1. Go to [Brevo Console](https://app.brevo.com)
2. Sign up or log in
3. Navigate to **Settings** → **SMTP & API**
4. Click on **API Keys** tab
5. Click **Create a new API key**
6. Copy the API key

### **Step 2: Update Backend .env**

In `backend/.env`, update:

```env
BREVO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx_YOUR_API_KEY_HERE
EMAIL_USER=matestaypvt@gmail.com
```

### **Step 3: Verify Your Sender Email in Brevo**

1. In Brevo dashboard, go to **Senders**
2. Check if `matestaypvt@gmail.com` is verified
3. If NOT verified:
   - Click **Add a new sender**
   - Enter your email and name
   - Brevo will send a verification email
   - Click the link in the email to verify

### **Step 4: Install Brevo Package**

In your `backend` folder, run:

```bash
npm install
```

This installs the `@getbrevo/brevo` package.

### **Step 5: Start Your Backend**

```bash
npm run dev
```

You should see:
```
✅ Brevo initialized successfully
```

---

## 📧 Email Functions

All three email functions are configured and ready:

### **1. Verification Email** (on registration)
- Sent when user registers
- User must click link to verify email
- Link expires in 24 hours

### **2. Password Reset Email** (on forgot password)
- Sent when user requests password reset
- Contains reset link
- Link expires in 15 minutes

### **3. Password Change Confirmation** (after password reset)
- Sent to confirm password change
- No action needed, just for user awareness

---

## 🧪 Test the Setup

### **Test 1: Register a User**

Use Postman or cURL:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "your-test-email@gmail.com",
  "password": "TestPassword123"
}
```

**Expected Response:**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "email": "your-test-email@gmail.com"
}
```

**What happens:**
- User created in database
- Verification email sent to `your-test-email@gmail.com`
- Check email inbox for verification link

### **Test 2: Verify Email**

Click the link in the verification email, or manually call:

```bash
GET http://localhost:5000/api/auth/verify-email?token=VERIFICATION_TOKEN_FROM_EMAIL
```

**Expected Response:**
```json
{
  "message": "Email verified successfully! You can now log in."
}
```

### **Test 3: Login**

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-test-email@gmail.com",
  "password": "TestPassword123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "verified": true,
    ...
  }
}
```

### **Test 4: Check Backend Logs**

When emails are sent, you should see in your terminal:

```
✅ Verification email sent to: your-test-email@gmail.com
```

If there's an error:

```
❌ Verification Email Error: {
  status: 400,
  message: "...",
  details: { ... }
}
```

---

## 🆘 Troubleshooting

### **❌ "BREVO_API_KEY not found"**
- Make sure you added `BREVO_API_KEY=...` to `backend/.env`
- Restart your server after updating .env

### **❌ Emails not being received**
- Check spam/junk folder
- Verify sender email is verified in Brevo dashboard
- Check terminal logs for error messages
- Ensure API key is correct

### **❌ "Invalid API key"**
- Go to Brevo dashboard → Settings → API Keys
- Generate a new API key
- Update your .env and restart server

### **❌ "Sender email not verified"**
- Go to Brevo dashboard → Senders
- Verify your sender email
- Wait a few minutes after verification

---

## 📱 Frontend Integration (Optional)

If you want to add email/password login UI to your frontend:

1. Create a registration form modal
2. Create a login form modal
3. Post to `/api/auth/register` and `/api/auth/login`
4. Store JWT token from response
5. Use token for authenticated requests

Currently, your frontend only has **Google OAuth** login. Email/password would be optional.

---

## ✨ You're All Set!

Your application is now ready to:
- ✅ Register users with email verification via Brevo
- ✅ Send password reset emails
- ✅ Authenticate with email/password
- ✅ Authenticate with Google OAuth (already working)

**Next:** Add a frontend login/registration form or test the API with Postman/cURL!

