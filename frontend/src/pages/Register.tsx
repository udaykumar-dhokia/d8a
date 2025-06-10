import React, {useState} from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import logo from "../assets/logo.png";
import axiosInstance from "../api/axios";

interface RegisterFormData {
	fullName: string;
	email: string;
	password: string;
}

const Register = () => {
	const [formData, setFormData] = useState<RegisterFormData>({
		fullName: '',
		email: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try{
			const response = await axiosInstance.post<RegisterFormData>("/auth/register", formData);
			setSuccess(`${response.data.message}!`);
		} catch (err: Any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
		<Header/>
		<div class="flex min-h-full flex-col justify-center px-6 py-42 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-sm">
				<img class="mx-auto h-14 w-auto" src={logo} alt="Analytix"/>
				<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account for free</h2>
			</div>

			<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form class="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label for="email" class="block text-sm/6 font-medium text-gray-900">Full Name</label>
						<div class="mt-2">
							<input onChange={handleChange} type="text" name="fullName" id="fullName" autocomplete="text" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"/>
						</div>
					</div>

					<div>
						<label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
						<div class="mt-2">
							<input onChange={handleChange} type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"/>
						</div>
					</div>

					<div>
						<div class="flex items-center justify-between">
							<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
						</div>
						<div class="mt-2">
							<input onChange={handleChange} type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"/>
						</div>
					</div>

					<div>
						<button type="submit" class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{ loading ? "Registering..." : "Register" }</button>
					</div>	
					{ error && <p style={{"color": "red"}}>{error}</p> }
					{ success && <p style={{"color": "green"}}>{success}</p> }
				</form>

				<p class="mt-10 text-center text-sm/6 text-gray-500">
					Already a member? 
					<a href="/login" class="font-semibold text-primary hover:text-indigo-500"> Login</a>
				</p>
			</div>
		</div>
		<Footer/>
		</>
		)
}

export default Register;