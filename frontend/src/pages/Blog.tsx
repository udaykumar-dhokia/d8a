import React from 'react';

const posts = [
  {
    title: 'Understanding Your Data: A Beginner\'s Guide',
    href: '#',
    description:
      'Diving into data can be daunting. This guide will walk you through the first steps of understanding and interpreting your data, no prior experience needed.',
    date: 'Mar 16, 2024',
    datetime: '2024-03-16',
    author: {
      name: 'Michael Foster',
      imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
  },
  {
    title: '5 Ways to Visualize Your Data for Impact',
    href: '#',
    description:
      'Learn how to create compelling data visualizations that tell a story. We cover five effective techniques to make your data more impactful.',
    date: 'Mar 10, 2024',
    datetime: '2024-03-10',
    author: {
      name: 'Lindsay Walton',
      imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
  },
  {
    title: 'The Future of Business Intelligence',
    href: '#',
    description:
      'Explore the trends shaping the future of business intelligence, from AI-driven insights to the rise of self-service analytics platforms.',
    date: 'Feb 12, 2024',
    datetime: '2024-02-12',
    author: {
      name: 'Tom Cook',
      imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
  },
];

const Blog = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <img
                  src={`https://source.unsplash.com/random/800x600?sig=${Math.floor(Math.random() * 1000)}`}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <a href="#">
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 