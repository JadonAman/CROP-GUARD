const { Router } = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  deletePost,
} = require('../controllers/Forum.controller');

const router = Router();

// Public: create and list posts
router.post('/posts', createPost);
router.get('/posts', getPosts);
router.get('/posts/:postId', getPostById);

// Admin or Expert: delete post (auth required, checked in controller)
router.delete('/posts/:postId', deletePost);

module.exports = router;
