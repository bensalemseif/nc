import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useAbout } from "../contexts/AboutProvider"; // Ensure the path is correct
import Spinner from "./Spinner";
const AboutAndContact = () => {
  const { aboutData } = useAbout();

  if (!aboutData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold  text-center text-gray-800 mb-12">
      About the Factory
      </h2>

      <div className="lg:flex lg:gap-16 ">
        {/* About the Factory Section */}

        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h3 className="text-3xl font-semibold text-gray-800 mb-8">
          {aboutData.companyName}
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            {aboutData.factoryInfo.description}
          </p>
          <div
            className="w-full h-80 bg-cover bg-center rounded-lg shadow-xl border border-gray-200"
            style={{ backgroundImage: `url(${aboutData.imagePath})` }}
          ></div>
        </div>

        {/* Contact Details Section */}
        <div className="lg:w-1/2 ">
          <h3 className="text-3xl font-semibold text-gray-800 mb-8">
            Contact Details
          </h3>
          <div className="space-y-3 mb-8">
            <ContactInfo
              Icon={FaMapMarkerAlt}
              title="Address"
              detail={aboutData.visitInfo.address}
            />
            <ContactInfo
              Icon={FaPhone}
              title="Phone"
              detail={aboutData.visitInfo.phone}
            />
            <ContactInfo
              Icon={FaEnvelope}
              title="Email"
              detail={aboutData.visitInfo.email || "info@factory.com"} // Add email if available
            />
          </div>

          <h3 className="text-3xl font-semibold text-gray-800 mb-4">
            Send Us a Message
          </h3>
          <form className="space-y-6 pr-8">
            <FormInput label="Name" type="text" placeholder="Your Name" />
            <FormInput label="Email" type="email" placeholder="Your Email" />
            <FormTextArea label="Message" placeholder="Your Message" />
            <button className="w-full px-6 py-3 bg-second text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ Icon, title, detail }) => (
  <div className="flex items-center gap-4 p-4">
    <Icon className="text-2xl text-second" />
    <div>
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      <p className="text-gray-600">{detail}</p>
    </div>
  </div>
);

const FormInput = ({ label, type, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      placeholder={placeholder}
    />
  </div>
);

const FormTextArea = ({ label, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      rows="4"
      placeholder={placeholder}
    ></textarea>
  </div>
);

export default AboutAndContact;
