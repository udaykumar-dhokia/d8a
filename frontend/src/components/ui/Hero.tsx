import React from "react";
import heroImg from "../../assets/back.jpg";

const Hero = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-8 lg:py-32">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl text-gray-900 sm:text-5xl dark:text-white">
            Your <strong className="text-primary">Data</strong>. Our
            <strong className="text-primary"> Intelligence. </strong>
            Better <strong className="text-primary">Outcomes</strong>.
          </h1>

          <p className="mt-4 text-base text-gray-700 sm:text-lg dark:text-gray-200">
            Our platform helps you visualize, analyze, and act on complex data — fast. No more guesswork. Just insights that drive growth.
          </p>

          <div className="mt-6 flex justify-center gap-4 lg:justify-start">
            <a
              className="inline-block rounded-lg border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              href="#"
            >
              Get Started
            </a>

            <a
              className="inline-block rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right: Image */}
        <div className="mt-10 lg:mt-0">
          <img
            src={heroImg}
            alt="Data analytics illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
