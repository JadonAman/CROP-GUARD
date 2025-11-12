import { useState, useEffect } from "react";
import { axiosInstance } from "../../axios.config";
import { FiUsers, FiActivity, FiTrendingUp, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ExpertDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, historyRes] = await Promise.all([
        axiosInstance.get("/auth/expert/analytics"),
        axiosInstance.get("/auth/expert/detection-history?limit=20")
      ]);
      
      setAnalytics(analyticsRes.data.analytics);
      setDetectionHistory(historyRes.data.detections);
    } catch (error) {
      console.error("Error fetching expert data:", error);
      if (error.response?.status === 403) {
        alert("Access denied. You need expert privileges to view this page.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading expert dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Expert Dashboard
            </span>
          </h1>
          <p className="text-gray-600">Monitor community activity and disease trends</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalUsers}</p>
                </div>
                <FiUsers className="text-4xl text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Detections</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalDetections}</p>
                </div>
                <FiActivity className="text-4xl text-cyan-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Recent (7 days)</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.recentDetections}</p>
                </div>
                <FiTrendingUp className="text-4xl text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Top Diseases</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.topDiseases.length}</p>
                </div>
                <FiAlertCircle className="text-4xl text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Top Diseases */}
        {analytics && analytics.topDiseases.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Most Common Diseases</h2>
            <div className="space-y-3">
              {analytics.topDiseases.slice(0, 5).map((disease, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{disease.disease}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {disease.count} detections
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Detection History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Recent Detection History (All Users)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disease
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detectionHistory.map((detection, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{detection.userName}</div>
                      <div className="text-sm text-gray-500">{detection.userEmail || detection.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{detection.plant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{detection.disease}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(detection.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detectionHistory.length === 0 && (
            <div className="text-center py-12">
              <FiActivity className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No detection history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
