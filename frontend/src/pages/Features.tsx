import React from 'react';
import { BarChart, Database, Zap, Table } from 'lucide-react';

const features = [
  {
    name: 'Advanced Data Visualization',
    description: 'Bring your data to life with a wide range of customizable charts and graphs. Understand trends and patterns at a glance.',
    icon: BarChart,
  },
  {
    name: 'Seamless Data Integration',
    description: 'Connect to all your data sources with ease. We support everything from simple CSV files to complex SQL databases.',
    icon: Database,
  },
  {
    name: 'Real-time Analytics',
    description: 'Get up-to-the-minute insights with our real-time data processing engine. Make decisions based on the latest information.',
    icon: Zap,
  },
  {
    name: 'Collaborative Dashboards',
    description: 'Share your findings with your team. Build and share interactive dashboards that foster a data-driven culture.',
    icon: Table,
  },
];

const Features = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Our Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to analyze your data
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Unlock the full potential of your data with our comprehensive suite of analytics tools. We provide everything you need to go from raw data to actionable insights.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features; 