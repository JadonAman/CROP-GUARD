const User = require("../models/User.model");
const Disease = require("../models/Disease.model");
const createHttpError = require("http-errors");
const { verifyJWT } = require("../helpers/jwtVerify.helper");

// Middleware to check if user is expert or admin
const checkExpert = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw createHttpError.Unauthorized("User not found");
    }
    
    // Check if user type is expert or admin
    if (user.type !== 'expert' && user.type !== 'admin') {
      throw createHttpError.Forbidden("Access denied. Expert privileges required.");
    }
    
    req.expertUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Get all disease detection history across all users
const getAllDetectionHistory = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    // Get all users with their detection history populated
    const users = await User.find({ detectionHistory: { $exists: true, $ne: [] } })
      .select('firstName lastName username email detectionHistory')
      .populate('detectionHistory')
      .sort({ 'detectionHistory.createdAt': -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    // Flatten detection history with user info
    const allDetections = [];
    users.forEach(user => {
      if (user.detectionHistory && user.detectionHistory.length > 0) {
        user.detectionHistory.forEach(detection => {
          allDetections.push({
            ...detection.toObject(),
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            username: user.username
          });
        });
      }
    });
    
    // Sort by date
    allDetections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      count: allDetections.length,
      detections: allDetections.slice(0, parseInt(limit))
    });
  } catch (err) {
    console.error('Get all detection history error:', err);
    next(createHttpError.InternalServerError('Failed to fetch detection history'));
  }
};

// Get expert analytics
const getExpertAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDetections = await Disease.countDocuments();
    
    // Get most common diseases
    const diseaseStats = await Disease.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDetections = await Disease.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalDetections,
        recentDetections,
        topDiseases: diseaseStats.map(d => ({ disease: d._id, count: d.count }))
      }
    });
  } catch (err) {
    console.error('Get expert analytics error:', err);
    next(createHttpError.InternalServerError('Failed to fetch analytics'));
  }
};

module.exports = {
  checkExpert,
  getAllDetectionHistory,
  getExpertAnalytics
};
