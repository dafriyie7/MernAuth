// import mongoose from "mongoose";

// const connectDB = async () => {
// 	try {
// 		mongoose.connection.on("connected", () =>
// 			console.log("Database connected")
// 		);

// 		await mongoose.connect(`${process.env.MONGO_URI}/mern-auth`);
// 	} catch (error) {
// 		console.log(error.message)
// 	}
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const uri = process.env.MONGO_URI;
		if (!uri) {
			throw new Error(
				"MONGO_URI is not defined in environment variables"
			);
		}

		// Optional: Handle connection events once
		mongoose.connection.once("connected", () => {
			console.log("MongoDB connected");
		});

		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err);
		});

		await mongoose.connect(`${uri}/mern-auth`);
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error.message);
		process.exit(1); // Exit process with failure
	}
};

export default connectDB;
