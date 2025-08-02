import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
	const navigate = useNavigate();
	const { userData, backendUrl, setUserData, setIsLoggedIn } =
		useContext(AppContext);

	const sendVerificationOtp = async () => {
				console.log("send verification function triggered");

		try {
			const { data } = await axios.post(
				backendUrl + `/api/auth/send-verify-otp`,
				null,
				{ withCredentials: true }
			);
			console.log("send verification response:" + data)

			if (data.success) {
				navigate("/email-verify");
				toast.success(data.message);
			} else {
				data.message;
			}
		} catch (error) {
			const message =
				error.response?.data?.message || "something went wrong";
			toast.error(message);
		}
	};

	const userLogout = async () => {
		console.log("Logout function triggered");

		try {
			const { data } = await axios.post(
				backendUrl + `/api/auth/logout`,
				null,
				{ withCredentials: true }
			);

			console.log("Logout response:", data);

			if (data.success) {
				setIsLoggedIn(false);
				setUserData(false);
				navigate("/");
				toast.success("logged out successfully");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error("Logout error:", error);
			const message =
				error.response?.data?.message || "Something went wrong";
			toast.error(message);
		}
	};

	return (
		<div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
			<img src={assets.logo} alt="" className="w-28 sm:w-32" />

			{userData ? (
				<div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
					{userData?.name?.charAt(0)?.toUpperCase() || "U"}

					<div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
						<ul className="list-none m-0 p-2 bg-gray-100 text-sm">
							{!userData.isVerified && (
								<li
									onClick={sendVerificationOtp}
									className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
								>
									Verify email
								</li>
							)}
							<li
								onClick={userLogout}
								className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
							>
								Logout
							</li>
						</ul>
					</div>
				</div>
			) : (
				<button
					onClick={() => navigate("/login")}
					className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
				>
					Login <img src={assets.arrow_icon} alt="" />
				</button>
			)}
		</div>
	);
};

export default Navbar;
