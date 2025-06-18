import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import axiosInstance from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface LoginFormData {
	email: string;
	password: string;
}

interface LoginResponse {
	message: string;
	token: string;
	themeMode: boolean;
}

const Login = () => {
	const navigate = useNavigate();
	const { setTheme } = useTheme();
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function for handling user login
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axiosInstance.post<LoginResponse>("/auth/login", formData);
			localStorage.setItem("token", response.data.token);
			
			setTheme(response.data.themeMode ? "dark" : "light");
			
			toast.success(response.data.message);
			navigate("/dashboard");
		} catch (err: any) {
			toast.error(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<main className="flex-1 flex items-center justify-center py-12 px-4">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight">
							{/* <span className="text-primary">d8a</span> */}
						</h1>
						<h2 className="mt-6 text-2xl font-semibold">Welcome back</h2>
						<p className="mt-2 text-muted-foreground">
							Sign in to your account to continue
						</p>
					</div>
					<Card className="border-none shadow-none">
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email" className="text-sm font-medium">
											Email address
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="name@example.com"
												value={formData.email}
												onChange={handleChange}
												required
												className="pl-10"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="password" className="text-sm font-medium">
											Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="password"
												name="password"
												type="password"
												placeholder="••••••••"
												value={formData.password}
												onChange={handleChange}
												required
												className="pl-10"
											/>
										</div>
									</div>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Signing in...
										</>
									) : (
										"Sign in"
									)}
								</Button>
							</form>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<div className="text-sm text-center text-muted-foreground">
								Don't have an account?{" "}
								<Link
									to="/register"
									className="text-primary hover:underline"
								>
									Sign up
								</Link>
							</div>
						</CardFooter>
					</Card>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Login;