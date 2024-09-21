import React, { useState, useEffect } from "react";
import {
  getPromotions,
  getPromotionsUpcoming,
} from "../../services/prmotionService";
import Timer3 from "../../components/Timer";
import { useHeroSection } from "../../contexts/HeroSectionContext";
import PagesHeroSection from "../../components/PagesHeroSection";
import Spinner from "../../components/Spinner";
import GlobalError from "../../components/GlobalError";

const ProductPromotionList = () => {
  const { heroData, loading, error } = useHeroSection();
  const [upcomingPromotions, setUpcomingPromotions] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const promotionsData = await getPromotions();
        const upcomingData = await getPromotionsUpcoming();
        setUpcomingPromotions(upcomingData);
        setActivePromotions(promotionsData);
      } catch (err) {}
    };
    fetchPromotions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  if (error) {
    return <GlobalError />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
    {heroData && (
      <PagesHeroSection
        title={heroData.promotions.title}
        subtitle={heroData.promotions.subTitle}
        backgroundImage={heroData.promotions.imagePath}
      />
    )}

    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
      {/* Upcoming Promotions Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900">
          Upcoming Promotions
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingPromotions.length > 0 ? (
            upcomingPromotions.map((promo) => (
              <li
                key={promo._id}
                className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <div
                  className="w-full h-60 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${promo.imagePath})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                    {promo.discountRate}% OFF
                  </div>
                  <div className="absolute top-4 left-4 text-white font-bold text-xl p-2">
                    {promo.name}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Timer3
                      countDownTime={promo.startDate}
                      durationFormat="hh:mm:ss"
                      size="text-lg"
                    />
                    <div className="mb-2 text-gray-200 text-sm">
                      <p>
                        <strong>Start:</strong>{" "}
                        {new Date(promo.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End:</strong>{" "}
                        {new Date(promo.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No upcoming promotions.</p>
          )}
        </ul>
      </section>

      {/* Active Promotions Section */}
      <section>
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900">
          Active Promotions
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activePromotions.length > 0 ? (
            activePromotions.map((promo) => (
              <li
                key={promo._id}
                className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <div
                  className="w-full h-60 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${promo.imagePath})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                    {promo.discountRate}% OFF
                  </div>
                  <div className="absolute top-4 left-4 text-white font-bold text-xl p-2">
                    {promo.name}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Timer3
                      textCol={"red"}
                      countDownTime={promo.endDate}
                      durationFormat="hh:mm:ss"
                      size="text-lg"
                    />
                    <div className="mb-2 text-gray-200 text-sm">
                      <p>
                        <strong>Start:</strong>{" "}
                        {new Date(promo.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End:</strong>{" "}
                        {new Date(promo.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No active promotions.</p>
          )}
        </ul>
      </section>
    </main>
  </div>
);
};


export default ProductPromotionList;  
