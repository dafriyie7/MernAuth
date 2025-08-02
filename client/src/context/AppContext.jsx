import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userData, setUserData] = useState(false);

	const getAuthState = async () => {
		try {
			const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {withCredentials: true})
			
			if (data.success) {
				setIsLoggedIn(true)
				getUserData()
			}
		} catch (error) {
			const message =
				error.response.data.message || "something went wrong";
			toast.error(message);
		}
	};

	const getUserData = async () => {
		try {
			const { data } = await axios.get(backendUrl + "/api/user/data", {
				withCredentials: true,
			});
			data.success
				? setUserData(data.userData)
				: toast.error(data.message);
		} catch (error) {
			console.log(error);
			const message =
				error.response.data.message || "something went wrong";

			return toast.error(message);
		}
	};

	useEffect(() => {
		getAuthState()
	},[])

	const value = {
		backendUrl,
		isLoggedIn,
		setIsLoggedIn,
		userData,
		setUserData,
		getUserData,
		axios,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
