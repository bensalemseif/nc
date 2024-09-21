import React from 'react';

const PagesHeroSection = ({ title, subtitle, backgroundImage }) => {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <h1
          className="text-6xl text-white sm:text-7xl xl:text-8xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {title}
        </h1>
        <p className="mt-4 text-xl text-white md:text-2xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PagesHeroSection;
