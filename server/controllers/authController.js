import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../configs/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../configs/emailTemplates.js";

// Controller for user registration
export const register = async (req, res) => {
	const { name, email, password } = req.body;

	// Validate input fields
	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });
	}

	try {
		// Check if a user with the given email already exists
		const existingUser = await userModel.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		// Hash the user's password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user instance
		const user = new userModel({
			name,
			email,
			password: hashedPassword,
		});

		// Save the new user to the database
		await user.save();

		// Generate a JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Set the JWT as an HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		// sending welcome email
		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject: "Wecome to MernAuth",
			text: `Welcom to MernAuth. Your account has been created with email id: ${email}`,
		};

		await transporter.sendMail(mailOptions);

		// Optionally, respond with user info or just success
		res.status(201).json({
			success: true,
			message: "User registered successfully",
		});
	} catch (error) {
		// Handle server errors
		res.status(500).json({ success: false, message: error.message });
	}
};

// Controller for user login
export const login = async (req, res) => {
	const { email, password } = req.body;

	// Validate input fields
	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "Email and password are required",
		});
	}

	try {
		// Find user by email
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email" });
		}

		// Compare provided password with stored hash
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid password" });
		}

		// Generate JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Set token as an HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		// Send success response
		return res
			.status(200)
			.json({ success: true, message: "Login successful" });
	} catch (error) {
		// Handle server errors
		return res.status(500).json({ success: false, message: error.message });
	}
};

// Controller for user logout
export const logout = async (req, res) => {
	try {
		// Clear the authentication cookie
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		});

		// Respond with success
		return res
			.status(200)
			.json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		// Handle server errors
		res.status(500).json({ success: false, message: error.message });
	}
};

export const sendVerifyOtp = async (req, res) => {
	try {
		const { userId } = req

		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid user ID" });
		}

		const user = await userModel.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (user.isAccountVerified) {
			return res
				.status(400)
				.json({ success: false, message: "Account already verified" });
		}

		const otp = String(Math.floor(100000 + Math.random() * 900000));
		user.verifyOtp = otp; // In production, consider hashing
		user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

		await user.save();

		const mailOption = {
			from: process.env.EMAIL_FROM,
			to: user.email,
			subject: "Account verification OTP",
			// text: `Your OTP is ${otp}. Verify your account using this OTP. It will expire in 10 minutes.`,
			html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
		};

		await transporter.sendMail(mailOption);

		res.status(200).json({
			success: true,
			message: "OTP verification sent to your email",
		});
	} catch (error) {
		console.error("Error sending OTP:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// verify email using OTP
export const verifyEmail = async (req, res) => {
	const { otp } = req.body
	const {userId} = req

	if (!userId || !otp) {
		return res
			.status(400)
			.json({ success: false, message: "Missing details" });
	}

	try {
		const user = await userModel.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (!user.verifyOtp || user.verifyOtp !== otp) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid OTP" });
		}

		if (user.verifyOtpExpireAt < Date.now()) {
			return res.status(400).json({
				success: false,
				message: "OTP expired. Please request a new one.",
			});
		}

		user.isVerified = true;
		user.verifyOtp = "";
		user.verifyOtpExpireAt = 0;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// check if user is verified
export const isAuthenticated = async (req, res) => {
	try {
		return res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// send password reset OTP
export const sendResetOtp = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res
			.status(400)
			.json({ success: false, message: "Email is required" });
	}

	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}

		const otp = String(Math.floor(100000 + Math.random() * 900000));

		user.resetOtp = otp;
		user.resetOtpExpireAt = Date.now() + 10 + 60 + 1000; // 10 minutes

		await user.save();

		const mailOption = {
			from: process.env.EMAIL_FROM,
			to: user.email,
			subject: "Password reset OTP",
			// text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password. It will expire in 10 minutes.`,
			html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
		};
		await transporter.sendMail(mailOption);

		return res
			.status(200)
			.json({ success: true, message: "OTP sent to your email" });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// reset password using OTP
export const resetpassword = async (req, res) => {
	const { email, otp, newPassword } = req.body
	
	if (!email || !otp || !newPassword) {
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });
	}

	try {
		const user = await userModel.findOne({ email })
		
		if (!user) {
			return res.status(404).json({success: false, message: "User not found"})
		}

		if (otp !== user.resetOtp || user.resetOtp === "") {
			return res.status(400).json({success: false, message: "Invalid OTP"})
		}

		if (user.resetOtpExpireAt > Date.now()) {
			return res.status(400).json({
				success: false, message: "OTP expired. Please request a new one."
			})
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		user.password = hashedPassword
		user.resetOtp = ""
		user.resetOtpExpireAt = 0
		
		await user.save()

		return res.status(200).json({success: true, message: "Password reset successfully"})
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message})
	}
}