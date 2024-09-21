import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AboutProvider } from "../contexts/AboutProvider";
import { HeroSectionProvider } from "../contexts/HeroSectionContext";
import { LandingPageProvider } from "../contexts/LandingPageProvider";
import ChatBubble from "../components/ChatBubble";

const UserLayout = () => {
  return (
    <LandingPageProvider>
      <AboutProvider>
        <HeroSectionProvider>
          <div>
            <Navbar />
            <Outlet />
            <ChatBubble />
            <Footer />
          </div>
        </HeroSectionProvider>
      </AboutProvider>
    </LandingPageProvider>
  );
};

export default UserLayout;
