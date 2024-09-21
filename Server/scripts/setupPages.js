const mongoose = require('mongoose');
const AboutPage = require('../models/settings/aboutModel');
const LandingPage = require('../models/settings/LandingPageModel'); 
const PromotionPage = require('../models/settings/promotionPageModel');
const ProductPage = require('../models/settings/productPageModel');

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    setupPages();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Function to set up page data
const setupPages = async () => {
  try {
    // Define the About Us page data
    const aboutPageData = {
      companyName: "Example Corp",
      factoryInfo: {
        description: "This is the about us page description."
      },
      keyFeatures: [
        { title: "Advanced Automation", description: "Our factory is highly automated, ensuring consistent quality and efficient production." },
        { title: "Sustainable Practices", description: "We prioritize eco-friendly and sustainable manufacturing processes to minimize our environmental impact." },
        { title: "Quality Assurance", description: "Our rigorous quality control measures ensure that every product meets the highest standards." }
      ],
      visitInfo: {
        address: "123 Main St, Anytown, USA",
        phone: "123-456-7890",
        mapEmbedUrl: "https://maps.google.com/embed?pb=..."
      },
      contactFormText: "Have a question or want to learn more about us? Fill out the form below and we’ll get back to you shortly.",
      imagePath: "http://example.com/logo.png"
    };

    // Check if the About Us page already exists
    const existingAboutPage = await AboutPage.findOne({});

    if (existingAboutPage) {
      // Update the existing About Us page
      await AboutPage.updateOne({}, aboutPageData);
      console.log('About Us page updated successfully.');
    } else {
      // Create a new About Us page
      const newAboutPage = new AboutPage(aboutPageData);
      await newAboutPage.save();
      console.log('About Us page created successfully.');
    }

    // Define the Landing Page data
    const landingPageData = {
      title: "Welcome to Our Site",
      subTitle: "Your gateway to excellence",
      imagePath: "http://example.com/landing-image.png"
    };

    // Check if the Landing Page already exists
    const existingLandingPage = await LandingPage.findOne({});

    if (existingLandingPage) {
      // Update the existing Landing Page
      await LandingPage.updateOne({}, landingPageData);
      console.log('Landing Page updated successfully.');
    } else {
      // Create a new Landing Page
      const newLandingPage = new LandingPage(landingPageData);
      await newLandingPage.save();
      console.log('Landing Page created successfully.');
    }
    
    // Define the Promotion Page data
    const promotionPageData = {
        title: "Limited Time Offer",
        subTitle: "Don't miss out on our exclusive deals!",
        imagePath: "http://example.com/promotion-image.png",
    };
    
    // Check if the Promotion Page already exists
    const existingPromotionPage = await PromotionPage.findOne({});
    
    if (existingPromotionPage) {
        // Update the existing Promotion Page
        await PromotionPage.updateOne({}, promotionPageData);
        console.log('Promotion Page updated successfully.');
        
    } else {
        // Create a new Promotion Page
        const newPromotionPage = new PromotionPage(promotionPageData);
        await newPromotionPage.save();
        console.log('Promotion Page created successfully.');
    }
    
    // Define the Product Page data
    const productPageData = {
        title: "Our Products",
        subTitle: "Explore our wide range of products",
        imagePath: "http://example.com/product-image.png",
        };
        
    // Check if the Product Page already exists
    const existingProductPage = await ProductPage.findOne({});
    
    if (existingProductPage) {
        // Update the existing Product Page
        await ProductPage.updateOne({}, productPageData);
        console.log('Product Page updated successfully.');
        
    } else {
        // Create a new Product Page
        const newProductPage = new ProductPage(productPageData);
        await newProductPage.save();
        console.log('Product Page created successfully.');
    }
    

    process.exit(0); // Exit the script after successful operation
  } catch (error) {
    console.error('Error setting up pages:', error.message);
    process.exit(1); // Exit the script with failure
  }
};
