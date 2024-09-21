import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../config/axiosConfig';

const LandingPageContext = createContext();

export const LandingPageProvider = ({ children }) => {
  const [landingPageData, setLandingPageData] = useState(null);

  useEffect(() => {
    const fetchLandingPageData = async () => {
      try {
        const response = await api.get('/settings/landingpage');
        setLandingPageData(response.data);
      } catch (error) {
      }
    };

    // Fetch the data only if it's not already fetched
    if (!landingPageData) {
      fetchLandingPageData();
    }
  }, [landingPageData]);

  return (
    <LandingPageContext.Provider value={landingPageData}>
      {children}
    </LandingPageContext.Provider>
  );
};

export const useLandingPageData = () => useContext(LandingPageContext);
