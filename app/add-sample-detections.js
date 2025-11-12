// Script to add sample disease detection data for testing
const mongoose = require('mongoose');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27018/test';

// Define schemas
const diseaseSchema = new mongoose.Schema({
  plant: String,
  disease: String,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  phone: String,
  password: String,
  avatar: String,
  type: String,
  detectionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disease' }]
});

const Disease = mongoose.model('Disease', diseaseSchema);
const User = mongoose.model('User', userSchema);

// Sample disease detection data
const sampleDetections = [
  { plant: 'Tomato', disease: 'Early Blight' },
  { plant: 'Tomato', disease: 'Late Blight' },
  { plant: 'Potato', disease: 'Late Blight' },
  { plant: 'Apple', disease: 'Apple Scab' },
  { plant: 'Corn', disease: 'Common Rust' },
  { plant: 'Tomato', disease: 'Leaf Mold' },
  { plant: 'Grape', disease: 'Black Rot' },
  { plant: 'Potato', disease: 'Early Blight' },
  { plant: 'Pepper', disease: 'Bacterial Spot' },
  { plant: 'Tomato', disease: 'Septoria Leaf Spot' },
  { plant: 'Apple', disease: 'Cedar Apple Rust' },
  { plant: 'Corn', disease: 'Northern Leaf Blight' },
  { plant: 'Tomato', disease: 'Spider Mites' },
  { plant: 'Potato', disease: 'Early Blight' },
  { plant: 'Grape', disease: 'Leaf Blight' }
];

async function addSampleData() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get the farmer user (mohit jadaun)
    const farmer = await User.findOne({ firstName: 'mohit' });
    
    if (!farmer) {
      console.log('No farmer user found. Please create a farmer user first.');
      process.exit(1);
    }

    console.log(`Found user: ${farmer.firstName} ${farmer.lastName}`);

    // Create disease detections
    const diseases = [];
    for (const detection of sampleDetections) {
      // Create disease with varied dates (last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      const disease = new Disease({
        plant: detection.plant,
        disease: detection.disease,
        createdAt: createdAt
      });
      
      await disease.save();
      diseases.push(disease._id);
      console.log(`Created: ${detection.plant} - ${detection.disease}`);
    }

    // Update farmer's detection history
    farmer.detectionHistory = diseases;
    await farmer.save();
    
    console.log(`\n✅ Successfully added ${diseases.length} sample detections to ${farmer.firstName}'s history!`);
    console.log('\nNow refresh the Expert Dashboard to see the data.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSampleData();
