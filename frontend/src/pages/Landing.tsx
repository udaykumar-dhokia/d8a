import { Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, LineChart, Zap, Database, Lock } from "lucide-react";

const Landing = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative py-20 px-4 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
					<div className="container mx-auto max-w-6xl relative">
						<div className="text-center space-y-8">
							<div className="inline-block">
								{/* <span className="text-primary font-bold text-2xl">d8a</span> */}
							</div>
							<h1 className="text-4xl md:text-7xl font-bold tracking-tight">
								Your Data,{" "}
								<span className="text-primary">Simplified</span>
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Upload, analyze, and visualize your CSV data with our powerful analytics platform. Make data-driven decisions with confidence.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" className="h-12 px-8" asChild>
									<Link to="/register">
										Get Started <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="h-12 px-8" asChild>
									<Link to="/login">Sign In</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-20">
					<div className="container mx-auto max-w-6xl px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold mb-4">
								Everything You Need for Data Analysis
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Powerful features to help you understand and visualize your data
							</p>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<Database className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">CSV Analysis</h3>
								<p className="text-muted-foreground">
									Upload and analyze CSV files with our advanced processing engine. Get instant insights into your data.
								</p>
							</div>
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<BarChart3 className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">Data Visualization</h3>
								<p className="text-muted-foreground">
									Transform complex data into clear, interactive visualizations. Understand patterns at a glance.
								</p>
							</div>
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<LineChart className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">Trend Analysis</h3>
								<p className="text-muted-foreground">
									Identify patterns and trends in your data with advanced analytics. Make predictions with confidence.
								</p>
							</div>
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<Zap className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">Fast Processing</h3>
								<p className="text-muted-foreground">
									Lightning-fast data processing and analysis. Get results in seconds, not minutes.
								</p>
							</div>
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<FileText className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">File Management</h3>
								<p className="text-muted-foreground">
									Organize and manage your files efficiently. Access your data anytime, anywhere.
								</p>
							</div>
							<div className="p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
								<Lock className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
								<p className="text-muted-foreground">
									Your data is protected with enterprise-grade security. Rest easy knowing your files are safe.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 px-4 bg-muted/50">
					<div className="container mx-auto max-w-4xl text-center">
						<h2 className="text-4xl font-bold mb-6">
							Ready to Transform Your Data?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Join thousands of users who trust d8a for their data analysis needs. Start your journey today.
						</p>
						<Button size="lg" className="h-12 px-8" asChild>
							<Link to="/register">
								Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Landing;