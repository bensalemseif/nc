const LandingPage = require('../../models/settings/LandingPageModel');


// Get LandingPage content
exports.getLandingPage = async (req, res) => {
  try {
    const landingPage = await LandingPage.findOne();
    res.status(200).json(landingPage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LandingPage content' });
  }
};

// Update LandingPage content
exports.updateLandingPage = async (req, res) => {
  try {
    const landingPageData = req.body;
    const landingPage = await LandingPage.findOneAndUpdate({}, landingPageData, { new: true, upsert: true });
    res.status(200).json(landingPage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update LandingPage content' });
  }
};

// create
exports.createLandingPage = async (req, res) => {
  try {
    const landingPageData = req.body;
    const landingPage = await LandingPage.create(landingPageData);
    res.status(201).json({ message: "LandingPage created successfully", data: landingPage });
    }catch(error){
    res.status(500).json({ error: 'Failed to create LandingPage content' });
  }
}
