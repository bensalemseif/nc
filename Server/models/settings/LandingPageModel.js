const mongoose = require('mongoose');

const landingPageSchema =  new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    subTitle:{
        type:String
    },
    imagePath:{
        type:String,
    }
})
module.exports = mongoose.model('LandingPage', landingPageSchema);