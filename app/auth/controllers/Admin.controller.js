const User = require("../models/User.model");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const { verifyJWT } = require("../helpers/jwtVerify.helper");

// Middleware to check if user is admin
const checkAdmin = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw createHttpError.Unauthorized("User not found");
    }
    
    // Check if user type is admin
    if (user.type !== 'admin') {
      throw createHttpError.Forbidden("Access denied. Admin privileges required.");
    }
    
    req.adminUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (err) {
    console.error('Get all users error:', err);
    next(createHttpError.InternalServerError('Failed to fetch users'));
  }
};

// Update user type
const updateUserType = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type } = req.body;
    
    // Validate type
    if (!['farmer', 'expert', 'admin'].includes(type)) {
      throw createHttpError.BadRequest('Invalid user type. Must be farmer, expert, or admin');
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { type },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      throw createHttpError.NotFound('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'User type updated successfully',
      user
    });
  } catch (err) {
    console.error('Update user type error:', err);
    next(err);
  }
};

// Change user password
const changeUserPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      throw createHttpError.BadRequest('Password must be at least 6 characters long');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).select('-password');
    
    if (!user) {
      throw createHttpError.NotFound('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      user
    });
  } catch (err) {
    console.error('Change password error:', err);
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.adminUser._id.toString()) {
      throw createHttpError.BadRequest('Cannot delete your own admin account');
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw createHttpError.NotFound('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error('Delete user error:', err);
    next(err);
  }
};

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const farmers = await User.countDocuments({ type: 'farmer' });
    const experts = await User.countDocuments({ type: 'expert' });
    const admins = await User.countDocuments({ type: 'admin' });
    
    res.status(200).json({
      success: true,
      stats: {
        total: totalUsers,
        farmers,
        experts,
        admins
      }
    });
  } catch (err) {
    console.error('Get stats error:', err);
    next(createHttpError.InternalServerError('Failed to fetch statistics'));
  }
};

// Create new user (admin only)
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, password, type } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      throw createHttpError.BadRequest('All fields are required');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      throw createHttpError.Conflict('User with this email or username already exists');
    }
    
    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone: phone || '',
      password: hashedPassword,
      type: type || 'farmer',
      avatar: '',
      detectionHistory: []
    });
    
    await newUser.save();
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    console.error('Create user error:', err);
    if (err.status) {
      next(err);
    } else {
      next(createHttpError.InternalServerError('Failed to create user'));
    }
  }
};

// Get system-wide detection analytics (admin only)
const getSystemAnalytics = async (req, res, next) => {
  try {
    const Disease = require('../models/Disease.model');
    
    // Total detections
    const totalDetections = await Disease.countDocuments();
    
    // Detections in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDetections = await Disease.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Most common plants
    const plantStats = await Disease.aggregate([
      { $group: { _id: '$plant', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Most common diseases
    const diseaseStats = await Disease.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Users with most detections
    const usersWithDetections = await User.aggregate([
      { $project: { firstName: 1, lastName: 1, username: 1, detectionCount: { $size: { $ifNull: ['$detectionHistory', []] } } } },
      { $match: { detectionCount: { $gt: 0 } } },
      { $sort: { detectionCount: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      analytics: {
        totalDetections,
        recentDetections,
        topPlants: plantStats.map(p => ({ plant: p._id, count: p.count })),
        topDiseases: diseaseStats.map(d => ({ disease: d._id, count: d.count })),
        topUsers: usersWithDetections
      }
    });
  } catch (err) {
    console.error('Get system analytics error:', err);
    next(createHttpError.InternalServerError('Failed to fetch system analytics'));
  }
};

// Delete detection from user history (admin only)
const deleteDetection = async (req, res, next) => {
  try {
    const Disease = require('../models/Disease.model');
    const { detectionId } = req.params;
    
    // Find and delete the detection
    const detection = await Disease.findByIdAndDelete(detectionId);
    if (!detection) {
      throw createHttpError.NotFound('Detection not found');
    }
    
    // Remove from user's detection history
    await User.updateMany(
      { detectionHistory: detectionId },
      { $pull: { detectionHistory: detectionId } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Detection deleted successfully',
      detectionId
    });
  } catch (err) {
    console.error('Delete detection error:', err);
    next(err);
  }
};

module.exports = {
  checkAdmin,
  getAllUsers,
  updateUserType,
  changeUserPassword,
  deleteUser,
  getUserStats,
  createUser,
  getSystemAnalytics,
  deleteDetection
};
