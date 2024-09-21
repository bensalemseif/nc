// src/pages/LandingPage.js

import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";
import { getPromotions } from "../services/prmotionService";
import {
  getBestSellingProducts,
  getProducts,
} from "../services/productService";
import BestSellingProducts from "../components/bestSelling";
import PromotionSlider from "../components/promotionSlider";
import AboutAndContact from "../components/aboutFactoey";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection"; 
const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [fallbackProducts, setFallbackProducts] = useState([]);
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoriesData = await getCategories();
        const promotionsData = await getPromotions();
        const bestSellingProductsData = await getBestSellingProducts();

        setCategories(categoriesData);

        const sortedPromotions = promotionsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPromotions(sortedPromotions);

        if (bestSellingProductsData.length === 0) {
          const fallbackProductsData = await getProducts();

          setFallbackProducts(fallbackProductsData);
        } else {
          setBestSellingProducts(bestSellingProductsData);
        }
      } catch (error) {
        throw error;
     }
    };

    fetchHomeData();
  }, []);


  return (
    <div className="relative overflow-x-hidden bg-gray-50">
      <HeroSection />
      <div className="py-16 px-6 lg:px-24">
        <CategoriesSection categories={categories} />
      </div>
      <div className="py-16 px-6 lg:px-24">
        <PromotionSlider promotions={promotions} />
      </div>
      <div className="py-16 px-6 lg:px-24">
        <BestSellingProducts
          bestSellingProducts={bestSellingProducts}
          fallbackProducts={fallbackProducts}
        />
      </div>
      <div className="py-16 px-6 lg:px-24 bg-gray-100">
        <AboutAndContact />
      </div>
    </div>
  );
};

export default LandingPage;
