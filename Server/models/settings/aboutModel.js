const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  factoryInfo: {
    description: { type: String, required: true },
  },
  keyFeatures: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  visitInfo: {
    //email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    mapEmbedUrl: { type: String, required: true },
  },
  contactFormText: { type: String, required: true },
  imagePath: { type: String},
});

const AboutPage = mongoose.model('About', aboutSchema);

module.exports = AboutPage;
