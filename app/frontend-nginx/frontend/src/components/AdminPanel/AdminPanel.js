import { useState, useEffect } from "react";
import { axiosInstance } from "../../axios.config";
import { FiUsers, FiUserCheck, FiUserX, FiShield, FiEdit2, FiTrash2, FiKey, FiRefreshCw, FiUserPlus } from "react-icons/fi";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, farmers: 0, experts: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    type: "farmer"
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        alert("Access denied. You need admin privileges to view this page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/auth/admin/users/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleChangeUserType = async (userId, newType) => {
    try {
      await axiosInstance.patch(`/auth/admin/users/${userId}/type`, { type: newType });
      alert("User type updated successfully!");
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Error updating user type:", error);
      alert(error.response?.data?.error?.message || "Failed to update user type");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await axiosInstance.patch(`/auth/admin/users/${selectedUser._id}/password`, {
        newPassword
      });
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.error?.message || "Failed to change password");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/auth/admin/users/${userToDelete._id}`);
      alert("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.error?.message || "Failed to delete user");
    }
  };

  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.firstName || !newUser.lastName || !newUser.username || !newUser.phone || !newUser.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (newUser.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await axiosInstance.post("/auth/admin/users", newUser);
      alert("User created successfully!");
      setShowCreateModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        type: "farmer"
      });
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.error?.message || "Failed to create user");
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'admin':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'expert':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'farmer':
        return 'text-green-700 bg-green-100 border-green-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'admin':
        return <FiShield className="inline mr-1" />;
      case 'expert':
        return <FiUserCheck className="inline mr-1" />;
      case 'farmer':
        return <FiUsers className="inline mr-1" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin text-5xl text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <FiUsers className="text-4xl text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Farmers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.farmers}</p>
              </div>
              <FiUsers className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Experts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.experts}</p>
              </div>
              <FiUserCheck className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.admins}</p>
              </div>
              <FiShield className="text-4xl text-red-500" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiUsers /> User Management
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-md"
            >
              <FiUserPlus /> Add New User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.type}
                        onChange={(e) => handleChangeUserType(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUserTypeColor(user.type)} cursor-pointer`}
                      >
                        <option value="farmer">Farmer</option>
                        <option value="expert">Expert</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all"
                          title="Change Password"
                        >
                          <FiKey size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <FiUserX className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiKey className="text-emerald-600" />
              Change Password
            </h3>
            <p className="text-gray-600 mb-4">
              Changing password for: <span className="font-semibold">{selectedUser?.username}</span>
            </p>
            <input
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <FiTrash2 />
              Delete User
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user{" "}
              <span className="font-semibold">{userToDelete?.username}</span>?
              <br />
              <span className="text-red-600 font-semibold">This action cannot be undone!</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-all shadow-lg"
              >
                Delete User
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <FiUserPlus />
              Create New User
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com (optional)"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  User Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.type}
                  onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="farmer">Farmer</option>
                  <option value="expert">Expert</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                    phone: "",
                    password: "",
                    type: "farmer"
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
