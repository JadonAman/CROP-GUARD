const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema({
  name: String,
  thumbnail: String,
  symptoms: String,
  trigger: String,
  // pathogen: String,
  organic: String,
  chemical: String,
  plant: String,  // Plant name for detection history
  disease: String, // Disease name for detection history
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "diseases"  // Changed to match the diseases collection
});

const Disease = mongoose.model("Disease", DiseaseSchema);

module.exports = Disease;
