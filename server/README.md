# MernAuth – Backend API

This is the **backend server** for the MernAuth project.  
It provides a secure **authentication and user management API**, built with **Node.js + Express + MongoDB**.  
Features include registration, login, JWT-based authentication, email verification, and password reset.

---

## Features

- **Authentication & Authorization**
  - Register, login, and logout endpoints
  - JWT-based session handling
  - Protected routes via middleware (`userAuth`)

- **Email Verification**
  - Send verification OTP via Nodemailer
  - Verify user accounts before access

- **Password Reset**
  - Request OTP for password reset
  - Reset password with token

- **User Management**
  - Fetch authenticated user data
  - Extendable user model with Mongoose

- **Security**
  - Encrypted passwords with bcrypt
  - Secure token handling

---

## Project Structure

```
server/
 ├── configs/               # Database and email configurations
 │   ├── db.js              # MongoDB connection
 │   ├── emailTemplates.js  # Email content templates
 │   └── nodemailer.js      # Nodemailer setup
 ├── controllers/           # Business logic for auth and users
 │   ├── authController.js
 │   └── userController.js
 ├── middlewares/
 │   └── userAuth.js        # JWT verification middleware
 ├── models/
 │   └── userModel.js       # User schema
 ├── routes/
 │   ├── authRoutes.js      # Auth endpoints
 │   └── userRoutes.js      # User endpoints
 ├── server.js              # App entry point
 ├── package.json           # Dependencies
 ├── .env                   # Environment variables
 └── vercel.json            # Deployment config
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT, bcrypt
- **Email:** Nodemailer
- **Deployment:** Vercel / Render / Any Node-compatible service

---

## 🔑 API Routes

### Auth (`/api/auth`)

- `POST /register` → Create new user  
- `POST /login` → Authenticate user  
- `POST /logout` → Logout user  
- `POST /send-verify-otp` → Send email OTP (requires auth)  
- `POST /verify-account` → Verify account with OTP (requires auth)  
- `GET /is-auth` → Check authentication status  
- `POST /send-reset-otp` → Send reset password OTP  
- `POST /reset-password` → Reset password  

### Users (`/api/users`)

- `GET /data` → Get authenticated user data (requires auth)  

---

## ⚡ Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd MernAuth/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mernAuth
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

5. The API will be available at:

   ```
   http://localhost:5000/api
   ```

---

## Future Enhancements

- Role-based access (admin, user)  
- Refresh token handling  
- Two-factor authentication  
- Account lockout policies  

---

## License

MIT License
