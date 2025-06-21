const About = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About d8a
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are a team of passionate data scientists and developers dedicated
            to helping you make sense of your data.
          </p>
        </div>

        <div className="mt-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-600">
                Our mission is to democratize data analysis. We believe that
                everyone should have access to powerful tools to understand
                their data, without needing a PhD in statistics. We're committed
                to building intuitive, powerful, and affordable analytics
                software for businesses of all sizes.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Our Story
              </h2>
              <p className="mt-4 text-gray-600">
                Founded in 2025, d8a started as a small project to solve a big
                problem: making data analytics accessible. Frustrated by the
                complexity and high cost of existing tools, our founders set out
                to create a platform that was both powerful and easy to use.
                Today, we're proud to serve thousands of users worldwide,
                helping them uncover insights and drive their businesses
                forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600">The brilliant minds behind d8a</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <img className="mx-auto h-24 w-24 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Team member" />
              <h3 className="mt-6 text-base font-medium text-gray-900">Jane Doe</h3>
              <p className="text-sm text-gray-500">Co-Founder & CEO</p>
            </div>
            <div className="text-center">
              <img className="mx-auto h-24 w-24 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Team member" />
              <h3 className="mt-6 text-base font-medium text-gray-900">John Smith</h3>
              <p className="text-sm text-gray-500">Co-Founder & CTO</p>
            </div>
            <div className="text-center">
              <img className="mx-auto h-24 w-24 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="Team member" />
              <h3 className="mt-6 text-base font-medium text-gray-900">Peter Jones</h3>
              <p className="text-sm text-gray-500">Lead Data Scientist</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default About;
