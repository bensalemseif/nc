const About = require('../../models/settings/aboutModel');

// create 
exports.createAbout =async(req,res)=>{
  try {
    const aboutData = req.body;
    const about = await About.create(aboutData);
    res.status(201).json({ message: "About created successfully", data: about });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create About content' });
  }
 };
// Get About content
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch About content' });
  }
};

// Update About content
exports.updateAbout = async (req, res) => {
  try {
    const aboutData = req.body;
    const about = await About.findOneAndUpdate({}, aboutData, { new: true, upsert: true });
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update About content' });
  }
};


