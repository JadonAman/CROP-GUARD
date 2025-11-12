const User = require("../models/User.model");
const Disease = require("../models/Disease.model");
const createHttpError = require("http-errors");
const { verifyJWT } = require("../helpers/jwtVerify.helper");

// Save detection to user's history
const saveDetection = async (req, res, next) => {
  try {
    const { plant, disease, userId } = req.body;
    
    if (!plant || !disease) {
      throw createHttpError.BadRequest('Plant and disease information required');
    }
    
    // Create disease record
    const diseaseRecord = new Disease({
      plant: plant,
      disease: disease,
      createdAt: new Date()
    });
    
    await diseaseRecord.save();
    
    // If userId provided, add to user's detection history
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.detectionHistory.push(diseaseRecord._id);
        await user.save();
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Detection saved successfully',
      detectionId: diseaseRecord._id
    });
  } catch (err) {
    console.error('Save detection error:', err);
    next(err);
  }
};

// Save detection for authenticated user
const saveMyDetection = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);
    const { plant, disease } = req.body;
    
    if (!plant || !disease) {
      throw createHttpError.BadRequest('Plant and disease information required');
    }
    
    // Create disease record
    const diseaseRecord = new Disease({
      plant: plant,
      disease: disease,
      createdAt: new Date()
    });
    
    await diseaseRecord.save();
    
    // Add to user's detection history
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError.NotFound('User not found');
    }
    
    user.detectionHistory.push(diseaseRecord._id);
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Detection saved to your history',
      detectionId: diseaseRecord._id
    });
  } catch (err) {
    console.error('Save my detection error:', err);
    next(err);
  }
};

module.exports = {
  saveDetection,
  saveMyDetection
};
