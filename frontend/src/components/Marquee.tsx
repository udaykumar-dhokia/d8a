import React from "react";

interface MarqueeProps {
  items: string[];
}

const Marquee: React.FC<MarqueeProps> = ({ items }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap w-full bg-white py-5">
      <div className="inline-block animate-marquee">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="mx-8 text-primary font-semibold text-2xl inline-block"
          >
            {item}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, idx) => (
          <span
            key={"dup-" + idx}
            className="mx-8 text-primary font-semibold text-2xl inline-block"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
