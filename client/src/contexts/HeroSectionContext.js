import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/axiosConfig'; // Adjust the import path accordingly

const HeroSectionContext = createContext();

export const useHeroSection = () => useContext(HeroSectionContext);

export const HeroSectionProvider = ({ children }) => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeroData = async () => {
    try {
      const [productsResponse, promotionsResponse] = await Promise.all([
        api.get('/settings/productpage'),
        api.get('/settings/promotionpage')
      ]);

      setHeroData({
        products: productsResponse.data,
        promotions: promotionsResponse.data,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  return (
    <HeroSectionContext.Provider value={{ heroData, loading, error }}>
      {children}
    </HeroSectionContext.Provider>
  );
};
