import React, { createContext, useState, useEffect, useMemo } from "react";
import api from "../config/axiosConfig";

const AboutContext = createContext();

export const AboutProvider = ({ children }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get("/settings/about");
        setAboutData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const contextValue = useMemo(
    () => ({ aboutData, loading, error }),
    [aboutData, loading, error]
  );

  return (
    <AboutContext.Provider value={contextValue}>
      {children}
    </AboutContext.Provider>
  );
};

export const useAbout = () => React.useContext(AboutContext);
