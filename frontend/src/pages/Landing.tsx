import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, LineChart, Shield } from "lucide-react";

const Landing = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="py-20 px-4">
					<div className="container mx-auto max-w-6xl">
						<div className="text-center space-y-8">
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
								Transform Your Data into{" "}
								<span className="text-primary">Actionable Insights</span>
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Upload your files, analyze patterns, and make data-driven decisions with our powerful analytics platform.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link to="/register">
										Get Started <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link to="/login">Sign In</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-20 bg-muted/50">
					<div className="container mx-auto max-w-6xl px-4">
						<h2 className="text-3xl font-bold text-center mb-12">
							Powerful Features for Data Analysis
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="p-6 bg-background rounded-lg shadow-sm">
								<FileText className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">File Analysis</h3>
								<p className="text-muted-foreground">
									Upload and analyze various file formats with our advanced processing engine.
								</p>
							</div>
							<div className="p-6 bg-background rounded-lg shadow-sm">
								<BarChart3 className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">Data Visualization</h3>
								<p className="text-muted-foreground">
									Transform complex data into clear, interactive visualizations.
								</p>
							</div>
							<div className="p-6 bg-background rounded-lg shadow-sm">
								<LineChart className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">Trend Analysis</h3>
								<p className="text-muted-foreground">
									Identify patterns and trends in your data with advanced analytics.
								</p>
							</div>
							<div className="p-6 bg-background rounded-lg shadow-sm">
								<Shield className="h-12 w-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
								<p className="text-muted-foreground">
									Your data is protected with enterprise-grade security measures.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 px-4">
					<div className="container mx-auto max-w-4xl text-center">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Get Started?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Join thousands of users who trust Analytix for their data analysis needs.
						</p>
						<Button size="lg" asChild>
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