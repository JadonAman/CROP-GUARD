const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorName: { type: String },
  authorEmail: { type: String },
  theme: { type: String, default: 'general' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
