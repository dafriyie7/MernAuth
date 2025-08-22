# MernAuth – Authentication Client

This is the **frontend client** for a MERN authentication system.  
It provides UI and functionality for user login, email verification, and password reset.  
The app is built with **React + Vite**, **Tailwind**, and integrated with backend authentication APIs.

[View live demo](https://mern-auth-iota-six.vercel.app/)

---

## Features

- **User Authentication**
  - Login with email and password
  - Email verification flow
  - Reset password with email token
- **Notifications**
  - Integrated with `react-toastify` for success/error feedback
- **Responsive UI**
  - Simple, clean components (Navbar, Header, Footer)
  - Asset-based icons and images
- **Context Management**
  - Global state via React Context (`AppContext`)

---

## Project Structure

```
client/
 ├── public/                # Static assets (favicon, bg image)
 ├── src/
 │   ├── assets/            # Icons, logos, email templates
 │   ├── components/        # Navbar, Header, Footer
 │   ├── context/           # AppContext for global state
 │   ├── pages/             # Home, Login, EmailVerify, ResetPassword
 │   ├── App.jsx            # Route configuration
 │   ├── main.jsx           # Entry point
 │   └── index.css          # Global styles
 ├── .env                   # Environment variables
 ├── package.json           # Project dependencies
 ├── vite.config.js         # Vite build configuration
```

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **State:** React Context API
- **Notifications:** react-toastify
- **Styling:** CSS
- **Deployment:** Vercel

---

## Routes

- `/` – Home page  
- `/login` – Login form  
- `/email-verify` – Email verification page  
- `/reset-password` – Reset password form  

---

## ⚡ Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/dafriyie7/MernAuth.git
   cd MernAuth/client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

---

## Future Enhancements

- Registration flow  
- Multi-factor authentication  
- Persistent sessions with refresh tokens  
- Role-based access (admin, user)

---

## License

MIT License
