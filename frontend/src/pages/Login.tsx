import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import logo from "../assets/logo.png";
import axiosInstance from "../api/axios";
import { toast } from "sonner"


interface LoginFormData {
	email: string;
	password: string;
};

const Login = () => {
	const navigate = useNavigate();

	useEffect(()=>{
		const token = localStorage.getItem("token");
		if (token){
			navigate("/dashboard");
		}
	}, []);

	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({...formData, [e.target.name]: e.target.value})
	}

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await axiosInstance.post<LoginFormData>("/auth/login", formData);
			setSuccess(`${response.data.message}!`);
			localStorage.setItem("token", response.data.token);
			toast(response.data.message);
			navigate("/dashboard");
		} catch (err: Any){
			setError(err.response?.data?.message || err.message);
			toast(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
		<Header/>
		<div class="flex min-h-full flex-col justify-center px-6 py-42 lg:px-8">
			<div className="">
				<div class="sm:mx-auto sm:w-full sm:max-w-sm">
					<img class="mx-auto h-14 w-auto" src={logo} alt="Analytix"/>
					<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login to your account</h2>
				</div>

				<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form class="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
						<div>
							<label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
							<div class="mt-2">
								<input type="email" onChange={handleChange} name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"/>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between">
								<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
								<div class="text-sm">
									<a href="#" class="font-semibold text-primary hover:text-primary">Forgot password?</a>
								</div>
							</div>
							<div class="mt-2">
								<input type="password" onChange={handleChange} name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"/>
							</div>
						</div>

						<div>
							<button type="submit" class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> { loading? "Logging...": "Login" }</button>
						</div>
					</form>

					<p class="mt-10 text-center text-sm/6 text-gray-500">
						Not a member? 
						<a href="/register" class="font-semibold text-primary hover:text-indigo-500"> Register Now</a>
					</p>
				</div>
			</div>
		</div>
		<Footer/>
		</>
		)
}

export default Login;