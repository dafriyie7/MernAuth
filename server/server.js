import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const PORT = process.env.PORT || 10000;

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true }));

// api endpoints
app.get("/", (req, res) => {
	res.send("server is live");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`server is running on port ${PORT}`);
	});
};

startServer();
