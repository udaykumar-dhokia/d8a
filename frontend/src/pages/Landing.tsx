import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, UploadCloud, BarChartBig } from "lucide-react";
import Hero from "../components/ui/Hero";
import FeaturesSectionDemo from "@/components/features-section-demo-2";
import Pricing from "./Pricing";
import HeroSectionOne from "@/components/hero-section-demo-1";

// const features = [
// 	{
// 		icon: <Database className="h-12 w-12 text-primary mb-4" />,
// 		title: "CSV Analysis",
// 		description: "Upload and analyze CSV files with our advanced processing engine. Get instant insights into your data."
// 	},
// 	{
// 		icon: <BarChart3 className="h-12 w-12 text-primary mb-4" />,
// 		title: "Data Visualization",
// 		description: "Transform complex data into clear, interactive visualizations. Understand patterns at a glance."
// 	},
// 	{
// 		icon: <LineChart className="h-12 w-12 text-primary mb-4" />,
// 		title: "Trend Analysis",
// 		description: "Identify patterns and trends in your data with advanced analytics. Make predictions with confidence."
// 	},
// 	{
// 		icon: <Zap className="h-12 w-12 text-primary mb-4" />,
// 		title: "Fast Processing",
// 		description: "Lightning-fast data processing and analysis. Get results in seconds, not minutes."
// 	},
// 	{
// 		icon: <FileText className="h-12 w-12 text-primary mb-4" />,
// 		title: "File Management",
// 		description: "Organize and manage your files efficiently. Access your data anytime, anywhere."
// 	},
// 	{
// 		icon: <Lock className="h-12 w-12 text-primary mb-4" />,
// 		title: "Secure Storage",
// 		description: "Your data is protected with enterprise-grade security. Rest easy knowing your files are safe."
// 	}
// ]

const Landing = () => {
  return (
    <>
      {/* <Hero /> */}
      <HeroSectionOne />
      {/* <Marquee
        items={[
          ".info()",
          ".describe()",
          "histogram",
          "scatter plot",
          "box plot",
          "correlation",
          "pivot table",
          "bar chart",
          "line chart",
          "data cleaning",
          "outlier detection",
        ]}
      /> */}
      <FeaturesSectionDemo />

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From upload to insight in just a few clicks.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="flex items-center justify-center h-20 w-20 bg-primary/10 text-primary rounded-full mx-auto mb-6">
                <UserPlus className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                1. Create an Account
              </h3>
              <p className="text-muted-foreground">
                Sign up for a free account in seconds. No credit card required.
              </p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-center h-20 w-20 bg-primary/10 text-primary rounded-full mx-auto mb-6">
                <UploadCloud className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                2. Upload Your Data
              </h3>
              <p className="text-muted-foreground">
                Securely upload your CSV files to our platform with a simple
                drag-and-drop.
              </p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-center h-20 w-20 bg-primary/10 text-primary rounded-full mx-auto mb-6">
                <BarChartBig className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                3. Analyze & Visualize
              </h3>
              <p className="text-muted-foreground">
                Instantly analyze your data and create stunning, interactive
                visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Loved by Data Professionals
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-card rounded-xl border shadow-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>  Star,

          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center bg-primary text-primary-foreground p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl opacity-80 mb-8">
            Join thousands of users who trust d8a for their data analysis needs.
            Start your journey today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-lg rounded-full"
          >
            <Link to="/register" className="flex items-center">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Landing;
