import userModel from "../models/userModel.js"

// get user details
export const getUserData = async (req, res) => {
	try {
		const { userId } = req
		
		if (!userId) {
			return res.status(404).json({success: false, message: "User not found"})
		}

		const user = await userModel.findById(userId).select("-password -__v")

		res.status(200).json({ success: true, userData: {
			name: user.name,
			isVerified: user.isVerified
		}})
	} catch (error) {
		res.status(500).json({success: false, message: error.message})
	}
}