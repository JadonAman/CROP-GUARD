import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../axios.config";
import { useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";

const Forum = () => {
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", theme: "general", content: "" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/forum/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content || !form.content.trim()) return alert("Message cannot be empty");

    try {
      await axiosInstance.post("/forum/posts", form);
      setForm({ authorName: "", authorEmail: "", theme: "general", content: "" });
      fetchPosts();
    } catch (err) {
      console.error("Failed to post message", err);
      alert(err.response?.data?.error?.message || "Failed to post message");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await axiosInstance.delete(`/forum/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
      alert(err.response?.data?.error?.message || "Failed to delete post");
    }
  };

  const canModerate = user && (user.type === 'admin' || user.type === 'expert');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Forum</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Your name (optional)"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Your email (optional)"
            value={form.authorEmail}
            onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="general">General</option>
            <option value="pests">Pests</option>
            <option value="diseases">Diseases</option>
            <option value="tips">Tips</option>
          </select>
        </div>

        <textarea
          rows={4}
          placeholder="Write your message here"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border mt-3 px-3 py-2 rounded"
        />

        <div className="flex justify-end mt-3">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">
            Post Message
          </button>
        </div>
      </form>

      <div>
        {loading ? (
          <div>Loading posts...</div>
        ) : (
          posts.map((p) => (
            <div key={p._id} className="mb-4 bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">
                  <strong>{p.authorName || 'Anonymous'}</strong>
                  {p.authorEmail && <span className="ml-2">• {p.authorEmail}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</div>
                  {canModerate && (
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-all"
                      title="Delete post"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-800 mb-2">{p.content}</div>
              <div className="text-xs text-gray-500">Theme: {p.theme}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;