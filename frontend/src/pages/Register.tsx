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
import { Loader2, User, Mail, Lock } from "lucide-react";

interface RegisterFormData {
	fullName: string;
	email: string;
	password: string;
}

interface RegisterResponse {
	message: string;
}

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<RegisterFormData>({
		fullName: "",
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
			const response = await axiosInstance.post<RegisterResponse>("/auth/register", formData);
			toast.success(response.data.message);
			navigate("/login");
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
						<h2 className="mt-6 text-2xl font-semibold">Create your account</h2>
						<p className="mt-2 text-muted-foreground">
							Join d8a and start analyzing your data today
						</p>
					</div>
					<Card className="border-none shadow-none">
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="fullName" className="text-sm font-medium">
											Full name
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="fullName"
												name="fullName"
												type="text"
												placeholder="John Doe"
												value={formData.fullName}
												onChange={handleChange}
												required
												className="pl-10"
											/>
										</div>
									</div>
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
									className="w-full h-11"
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating account...
										</>
									) : (
										"Create account"
									)}
								</Button>
							</form>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4 pt-0">
							<div className="text-sm text-muted-foreground text-center">
								Already have an account?{" "}
								<Link to="/login" className="text-primary hover:text-primary/90 font-medium">
									Sign in
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

export default Register;