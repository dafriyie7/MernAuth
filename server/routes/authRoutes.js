import express from "express";
import { isAuthenticated, login, logout, register, resetpassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter
	.post("/register", register)
	.post("/login", login)
	.post("/logout", logout)
	.post("/send-verify-otp", userAuth, sendVerifyOtp)
	.post("/verify-account", userAuth, verifyEmail)
	.post("/is-auth", userAuth, isAuthenticated)
	.post("/send-reset-otp", sendResetOtp)
	.post("/reset-password", resetpassword);




export default authRouter;