const Post = require('../models/Post.model');
const createHttpError = require('http-errors');
const User = require('../models/User.model');
const { verifyJWT } = require('../helpers/jwtVerify.helper');

// Create a new post (public)
const createPost = async (req, res, next) => {
  try {
    const { authorName, authorEmail, theme, content } = req.body;

    if (!content || !content.trim()) {
      throw createHttpError.BadRequest('Content is required');
    }

    const post = new Post({
      authorName: authorName || undefined,
      authorEmail: authorEmail || undefined,
      theme: theme || 'general',
      content: content.trim(),
    });

    await post.save();

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error('Create post error:', err);
    next(err);
  }
};

// Get posts, optionally filtered by theme
const getPosts = async (req, res, next) => {
  try {
    const { theme, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (theme) filter.theme = theme;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit));
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (err) {
    console.error('Get posts error:', err);
    next(err);
  }
};

// Get single post by id
const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) throw createHttpError.NotFound('Post not found');
    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error('Get post error:', err);
    next(err);
  }
};

// Delete post (admin or expert)
const deletePost = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);
    const user = await User.findById(decoded.userId);
    
    if (!user || (user.type !== 'admin' && user.type !== 'expert')) {
      throw createHttpError.Forbidden('Only admins and experts can delete posts');
    }

    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) throw createHttpError.NotFound('Post not found');
    res.status(200).json({ success: true, message: 'Post deleted', postId });
  } catch (err) {
    console.error('Delete post error:', err);
    next(err);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
};
