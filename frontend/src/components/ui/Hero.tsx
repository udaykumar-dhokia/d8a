import { Button } from "./moving-border";

const Hero = () => {
  return (
    <section className="relative bg-white dark:bg-gray-900">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-50 dark:bg-gray-800" />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-8 lg:py-32">
        {/* Left: Text Content */}
        <div className="text-center lg:text-left z-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Your <span className="text-primary">Data</span>, Our
            <span className="text-primary"> Intelligence</span>,
            <br />
            Better <span className="text-primary">Outcomes</span>.
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our platform helps you visualize, analyze, and act on complex data —
            fast. No more guesswork. Just insights that drive growth.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm hover:text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <a href="/register">Get Started for Free</a>
            </Button>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Learn More <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Right: Image */}
        <div className="mt-10 lg:mt-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-3xl opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
              alt="Data analytics illustration"
              className="relative w-full h-auto rounded-xl shadow-xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
