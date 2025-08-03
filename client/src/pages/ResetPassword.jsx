import { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ResetPassword = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState('')
	const [isEmailSent, setIsEmailSent] = useState('')
	const [otp, setOtp] = useState(0)
	const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

	const { backendUrl } = useContext(AppContext)
	
	const inputRefs = useRef([]);
	
		const handleInput = (e, index) => {
			if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
				inputRefs.current[index + 1].focus();
			}
		};
	
		const handleKeyDown = (e, index) => {
			if (e.key === "Backspace" && e.target.value === "" && index > 0) {
				inputRefs.current[index - 1].focus();
			}
		};
	
		const handlePaste = (e) => {
			const paste = e.clipboardData.getData("text");
			const pasteArray = paste.split("");
			pasteArray.forEach((char, index) => {
				if (inputRefs.current[index]) {
					inputRefs.current[index].value = char;
				}
			});
		};
	
	const handleSendEmail = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp", { email }, { withCredentials: true })
			
			if (data.success) {
				setIsEmailSent(true)
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			const message = error.response?.data?.message || "something went wrong"
			toast.error(message)
		}
	}

	const handleSendOtp = async (e) => {
		try {
			e.preventDefault();

			const otpArray = inputRefs.current.map((e) => e.value);
			setOtp(otpArray.join(""));
			setIsOtpSubmitted(true);
		} catch (error) {
			const message =
				error.response?.data?.message || "something went wrong";
			toast.error(message);
		}
	}

	const handleResetpassword = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(backendUrl + "/api/auth/reset-password", {email, newPassword, otp})
			
			if (data.success) {
				toast.success(data.message)
				navigate('/login')
			}
		} catch (error) {
			const message =
				error.response?.data?.message || "something went wrong";
			toast.error(message);
		}
	}
	
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
			<img
				onClick={() => navigate("/")}
				src={assets.logo}
				alt=""
				className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
			/>

			{/* enter email  */}
			{!isEmailSent && (
				<form onSubmit={handleSendEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
					<h1 className="text-white text-2xl font-semibold text-center mb-4">
						Reset Password
					</h1>

					<p className="text-center mb-6 text-indigo-300">
						Enter your registered email address.
					</p>

					<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
						<img
							src={assets.mail_icon}
							alt=""
							className="w-3 h-3"
						/>
						<input
							type="email"
							placeholder="email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="bg-transparent outline-none text-white"
						/>
					</div>

					<button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">
						Submit
					</button>
				</form>
			)}

			{/* otp input form */}
			{isEmailSent && !isOtpSubmitted && (
				<form
					onSubmit={handleSendOtp}
					className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
				>
					<h1 className="text-white text-2xl font-semibold text-center mb-4">
						New Password
					</h1>
					<p className="text-center mb-6 text-indigo-300">
						Enter the new password below
					</p>
					<div
						onPaste={handlePaste}
						className="flex justify-between mb-8"
					>
						{Array(6)
							.fill(0)
							.map((_, index) => (
								<input
									type="text"
									maxLength="1"
									key={index}
									required
									ref={(e) => (inputRefs.current[index] = e)}
									onInput={(e) => handleInput(e, index)}
									onKeyDown={(e) => handleKeyDown(e, index)}
									className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md"
								/>
							))}
					</div>
					<button className="w-full p-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">
						Submit
					</button>
				</form>
			)}

			{/* enter new password */}
			{isEmailSent && isOtpSubmitted && (
				<form onSubmit={handleResetpassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
					<h1 className="text-white text-2xl font-semibold text-center mb-4">
						Reset Password
					</h1>

					<p className="text-center mb-6 text-indigo-300">
						Enter your registered email address.
					</p>

					<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
						<img
							src={assets.lock_icon}
							alt=""
							className="w-3 h-3"
						/>
						<input
							type="password"
							placeholder="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className="bg-transparent outline-none text-white"
						/>
					</div>

					<button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">
						Submit
					</button>
				</form>
			)}
		</div>
	);
};

export default ResetPassword;
