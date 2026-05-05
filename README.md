# Matestay
live demo-https://matestay-fx9k.vercel.app/


Matestay is a production-ready full‑stack web application to find roommates and rental properties.  
This repository contains a React + Vite frontend and a Node.js + Express + MongoDB backend with features for listings, real‑time chat (Socket.IO), payments (Razorpay), admin tools, and email flows powered by SendGrid.

Quick links
- Backend server: [backend/server.js](backend/server.js)  
- Auth & email: [backend/controllers/authController.js](backend/controllers/authController.js) — uses [backend/services/emailSendgrid.js](backend/services/emailSendgrid.js) and [backend/config/sendgrid.js](backend/config/sendgrid.js)  
- Public user search: [backend/controllers/userController.js](backend/controllers/userController.js) & routes [backend/routes/userRoutes.js](backend/routes/userRoutes.js)  
- Frontend location search page: [frontend/src/pages/LocationSearchPage.jsx](frontend/src/pages/LocationSearchPage.jsx)  
- Frontend search entry (Hero): [frontend/src/components/Hero.jsx](frontend/src/components/Hero.jsx)  
- Axios instance (API base config & auth handling): [frontend/src/api/axiosInstance.js](frontend/src/api/axiosInstance.js)  
- Frontend auth provider: [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)  
- User model: [backend/models/User.js](backend/models/User.js)

---

## Features

- Email/password authentication with email verification via SendGrid
- Google OAuth support (Passport)
- Create / edit / delete property listings with images (Cloudinary)
- Location search: properties + roommates (public search)
- Real‑time chat (Socket.IO) with unread counts and message limits for free users
- Payments & premium subscriptions via Razorpay
- Admin panel: view/delete users & properties with cascade cleanup
- Input validation (Joi), rate limiting, and centralized error handling

---

## Quick start (local)

1. Clone repo:
   git clone <repo-url>
   cd Matestay

2. Backend
   cd backend
   npm install
   copy `.env.example` → `.env` and fill values (see Environment section)
   npm run dev

3. Frontend
   cd frontend
   npm install
   copy `.env.example` → `.env` and set VITE_API_URL (default http://localhost:5000/api)
   npm run dev

Frontend default: http://localhost:5173  
Backend default: http://localhost:5000

---

## Environment variables

Backend (.env) — minimal required keys:
- MONGODB_URI=... (Mongo Atlas connection)
- JWT_SECRET=...
- CLIENT_URL=http://localhost:5173
- SENDGRID_API_KEY=...
- EMAIL_USER=you@yourdomain.com (verified sender)
- CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
- RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (for Google OAuth)
- SESSION_SECRET

Frontend (.env):
- VITE_API_BASE_URL=http://localhost:5000/api
- VITE_GOOGLE_CLIENT_ID=...

Important: Passport (Google) will throw "OAuth2Strategy requires a clientID option" if GOOGLE_CLIENT_ID is missing. See [backend/config/passport.js](backend/config/passport.js) (import order matters: dotenv must run before passport config).

---

## SendGrid email (production notes)

This project uses SendGrid for verification & password emails.

Checklist:
- Add SENDGRID_API_KEY to backend `.env`.
- Ensure `EMAIL_USER` is a verified sender or a domain authenticated in your SendGrid account.
- Check SendGrid Email Activity for delivery/delivery errors.
- Fallback: a local `backend/utils/sendEmail.js` (nodemailer) exists for dev/testing but production should use SendGrid.

Files:
- Initialization: [backend/config/sendgrid.js](backend/config/sendgrid.js)  
- Email templates / helpers: [backend/services/emailSendgrid.js](backend/services/emailSendgrid.js)  
- Auth flows calling SendGrid: [backend/controllers/authController.js](backend/controllers/authController.js)

---

## Common troubleshooting

- OAuth error "OAuth2Strategy requires a clientID option": set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend env.
- "The `uri` parameter to `openUri()` must be a string, got undefined.": MONGODB_URI missing/incorrect. See [backend/config/db.js](backend/config/db.js).
- Verification emails not sending: check SendGrid key, verified sender, and app logs. Use `GET /api/test-email` or check SendGrid Activity.
- 500s creating listings: inspect backend logs and ensure client sends required fields (title, description, propertyType, location, rent). See [backend/controllers/propertyController.js](backend/controllers/propertyController.js).
- Roommates not showing in location search: frontend must call `/user/search-public` (see [frontend/src/pages/LocationSearchPage.jsx](frontend/src/pages/LocationSearchPage.jsx)) and backend `searchUsers` supports location matching (see [backend/controllers/userController.js](backend/controllers/userController.js)).

---

## API reference (high level)

Auth
- POST /api/auth/register — register & send verification email
- GET /api/auth/verify-email?token=... — verify email
- POST /api/auth/login

Users
- GET /api/user/search-public?location=...
- GET /api/user/featured
- GET /api/user/public-profile/:userId

Properties
- GET /api/properties/search?location=...
- GET /api/properties/featured
- POST /api/properties (protected)

Messages & Conversations
- POST /api/conversations (protected)
- POST /api/messages (protected)

Admin (protected + admin)
- GET /api/admin/users
- DELETE /api/admin/users/:id

---

## Deploy & share

- Frontend: Vercel/Netlify. Set VITE_API_BASE_URL to backend production URL.
- Backend: Render/Heroku/DigitalOcean. Set env vars in deployment dashboard.
- For public testing from local, use a tunnel (ngrok) and set CLIENT_URL to the public URL.

---

## Project maintenance

- Lint: frontend `npm run lint`
- Build: frontend `npm run build`
- Run tests: backend has Jest tests in `backend/__tests__` (if configured). See [backend/jest.config.js](backend/jest.config.js).

---

## Contributing

1. Fork → feature branch → PR
2. Add tests for new behavior
3. Include screenshots and step-by-step reproduction if fixing bugs

---

## Contacts & Support

Project emails: matestaypvt@gmail.com, shashankmuz3@gmail.com, sujalbhatt500@gmail.com  
For deployment or SendGrid help, check SendGrid dashboard & repo logs.

---

## License

MIT License

Copyright (c) 2025 @sujalbhatt00

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
