import React from "react";
import { useLandingPageData } from "../contexts/LandingPageProvider";
import Spinner from "./Spinner";

const HeroSection = () => {
  const landingPageData = useLandingPageData();

  if (!landingPageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="w-full aspect-video bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${landingPageData?.imagePath})` }}
    >
      {landingPageData.title !== ".." && landingPageData.subTitle !== ".." ? (
        <div className="absolute inset-0 flex  md:flex-row items-center justify-between bg-black bg-opacity-50 px-4 md:px-8 uppercase">
          <div className="text-left ml-0 md:ml-20 text-white sm:mb-[60px]">
            <h1 className="animate-typing overflow-hidden whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
              {landingPageData.title || "WELCOME TO NECTAR"}
            </h1>
            <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-light mt-4 sm:mt-6">
              {landingPageData.subTitle ||
                "We know how large objects will act, but things on a small scale."}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HeroSection;
