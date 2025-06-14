import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import logo from "../assets/logo.png";
import axiosInstance from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/dashboard");
		}
	}, [navigate]);

	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axiosInstance.post<LoginFormData>("/auth/login", formData);
			localStorage.setItem("token", response.data.token);
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
			<main className="flex-1 flex items-center justify-center py-12">
				<Card className="w-full max-w-md mx-4">
					<CardHeader className="space-y-1">
						<div className="flex justify-center">
							<img className="h-12 w-auto" src={logo} alt="Analytix" />
						</div>
						<CardTitle className="text-2xl text-center">Welcome back</CardTitle>
						<CardDescription className="text-center">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="name@example.com"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link
										to="/forgot-password"
										className="text-sm text-primary hover:text-primary/90"
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									required
									className="w-full"
								/>
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
						<div className="text-sm text-muted-foreground text-center">
							Don't have an account?{" "}
							<Link to="/register" className="text-primary hover:text-primary/90">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>
			<Footer />
		</div>
	);
};

export default Login;