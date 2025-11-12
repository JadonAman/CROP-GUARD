import React, { useEffect, useState, useRef } from "react";
import Map from "./Map";
import { axiosInstance } from "../../axios.config";
import CountUp, { useCountUp } from "react-countup";
import ApexChart1 from "./ApexChart1";
import ApexChart2 from "./ApexChart2";
import ApexBarChart from "./ApexBarChart";
import PieChart from "./PieChart";
import { GiCorn } from "react-icons/gi";
const defaultMaps = [
  {
    _id: "MH",
    numberOfValue: 24,
  },
  {
    _id: "GJ",
    numberOfValue: 46,
  },
  {
    _id: "TN",
    numberOfValue: 44,
  },
  {
    _id: "KA",
    numberOfValue: 120,
  },
  {
    _id: "PB",
    numberOfValue: 10,
  },
  {
    _id: "TS",
    numberOfValue: 80,
  },
  {
    _id: "WB",
    numberOfValue: 60,
  },
  {
    _id: "OD",
    numberOfValue: 35,
  },
];

const defaultPlants = {
  legends: [
    "Corn_(maize)",
    "Tomato",
    "Potato",
    "Grape",
    "Pepper bell",
    "Strawberry",
    "Apple",
  ],
  data: [2, 5, 4, 1, 7, 1, 4],
};

const defaultDisease = {
  legends: [
    "Apple Black rot",
    "Apple scab",
    "Potato Early blight",
    "Grape Black rot",
    "Tomato Septoria leaf spot",
    "Tomato Target Spot",
    "Corn Common rust",
    "Strawberry Leaf scorch",
    "Pepper_bell Bacterial spot",
  ],
  data: [2, 2, 4, 1, 4, 1, 2, 1, 7],
};

function Dashboard() {
  const [mapData, setMapData] = useState(defaultMaps);
  const [plantData, setPlantData] = useState(defaultPlants);
  const [diseaseData, setDiseaseData] = useState(defaultDisease);

  useEffect(() => {
    let componentMounted = true;

    const getData = async () => {
      try {
        const res = await axiosInstance.get("/auth/dashboard");
        const data = res.data;
        if (!data) return;

        componentMounted && setMapData(data.mapData);
        componentMounted && setDiseaseData(data.diseaseData);
        componentMounted && setPlantData(data.plantData);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        // Keep using default data if API fails
      }
    };

    getData();

    return () => {
      componentMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                📊 Dashboard
              </h1>
              <p className="text-emerald-100 text-lg">
                Real-time insights and analytics for Crop Guard
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                <p className="text-sm text-emerald-100">Last Updated</p>
                <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Visitors Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 transform">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <span className="text-4xl">👥</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  +12% ↗
                </div>
              </div>
              <p className="text-white/80 text-sm font-semibold mb-2">Total Visitors</p>
              <p className="text-5xl font-bold text-white">
                <CountUp end={527} duration={2.5} />
              </p>
            </div>
            <div className="bg-emerald-50 p-4">
              <p className="text-emerald-700 text-sm font-semibold">All-time visits</p>
            </div>
          </div>

          {/* Total Predictions Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 transform">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <span className="text-4xl">🔬</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  Active
                </div>
              </div>
              <p className="text-white/80 text-sm font-semibold mb-2">Total Predictions</p>
              <p className="text-5xl font-bold text-white">
                <CountUp end={261} duration={2.5} />
              </p>
            </div>
            <div className="bg-blue-50 p-4">
              <p className="text-blue-700 text-sm font-semibold">Disease detections made</p>
            </div>
          </div>

          {/* Most Affected Plant Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 transform">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <GiCorn className="text-4xl text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  Today
                </div>
              </div>
              <p className="text-white/80 text-sm font-semibold mb-2">Most Affected</p>
              <p className="text-3xl font-bold text-white mb-1">🌽 Corn</p>
            </div>
            <div className="bg-amber-50 p-4">
              <p className="text-amber-700 text-sm font-semibold">Plant with most diseases</p>
            </div>
          </div>

          {/* Today's Predictions Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 transform">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <span className="text-4xl">📈</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  24h
                </div>
              </div>
              <p className="text-white/80 text-sm font-semibold mb-2">Today's Predictions</p>
              <p className="text-5xl font-bold text-white">
                <CountUp end={17} duration={2.5} />
              </p>
            </div>
            <div className="bg-rose-50 p-4">
              <p className="text-rose-700 text-sm font-semibold">Predictions in last 24h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* First Row - Large Charts */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl">
                <span className="text-2xl">🌱</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Plant Affected by Diseases</h2>
            </div>
            <ApexBarChart />
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Disease Detection by Month</h2>
            </div>
            <ApexChart1 />
          </div>

          {/* Second Row - Three Column Charts */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                <span className="text-2xl">🥧</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Prediction Distribution</h2>
            </div>
            <PieChart />
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Detection by Day</h2>
            </div>
            <ApexChart2 />
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl">
                <span className="text-2xl">🗺️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Disease per State</h2>
            </div>
            <Map mapData={mapData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
