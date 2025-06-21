import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    price: { monthly: "FREE", annually: "FREE" },
    description: "Perfect for students, hobbyists, and small-scale projects.",
    features: [
      "Analyze up to 10 files per month",
      "Up to 25MB file size",
      "Basic data visualizations",
      "Community support",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    price: { monthly: "$49", annually: "$490" },
    description:
      "For data professionals and small businesses requiring more power.",
    features: [
      "Analyze up to 100 files per month",
      "Up to 100MB file size",
      "Advanced data visualizations",
      "Data cleaning & transformation",
      "Email and chat support",
    ],
    mostPopular: true,
  },
  {
    name: "Business",
    id: "tier-business",
    href: "#",
    price: { monthly: "Custom", annually: "Custom" },
    description: "For large organizations with custom needs.",
    features: [
      "Unlimited file analysis",
      "Collaboration features",
      "API access & integrations",
      "Dedicated account manager",
    ],
    mostPopular: false,
  },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const Pricing = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find the Right Plan for Your Data
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Simple, transparent pricing for projects of all sizes. Start your
            14-day free trial today.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular
                  ? "relative bg-white shadow-2xl"
                  : "bg-gray-50 sm:mx-8 lg:mx-0",
                tier.mostPopular
                  ? ""
                  : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                  : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
                "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
              )}
            >
              <h3
                id={tier.id}
                className="text-base font-semibold leading-7 text-primary"
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  {tier.price.monthly}
                </span>
                <span className="text-base text-gray-500">/month</span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-600">
                {tier.description}
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-primary text-white shadow-sm hover:bg-primary/80"
                    : "text-primary ring-1 ring-inset ring-primary hover:ring-primary/80",
                  "mt-8 block rounded-full py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:mt-10"
                )}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
