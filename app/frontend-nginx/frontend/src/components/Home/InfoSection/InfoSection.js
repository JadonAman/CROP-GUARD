import React from "react";
import { Button } from "../Button";

const InfoSection = ({
  lightBg,
  id,
  imgStart,
  lightText,
  darkText,
  img,
  alt,
  primary,
  dark,
  dark2,
  t,
}) => {
  return (
    <div
      id={id}
      className={`py-20 px-4 ${
        lightBg
          ? "bg-gradient-to-br from-gray-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            imgStart ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text Content */}
          <div className={`${imgStart ? "lg:order-2" : "lg:order-1"} space-y-6`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-wider">
                {t[0]}
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`text-4xl md:text-5xl font-bold leading-tight ${
                lightText ? "text-white" : "text-gray-900"
              }`}
            >
              {t[1]}
            </h2>

            {/* Description */}
            <p
              className={`text-lg md:text-xl leading-relaxed ${
                darkText ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {t[2]}
            </p>

            {/* Button */}
            <div className="pt-4">
              <button
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  primary && dark
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/50"
                    : "bg-white text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {t[3]}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* Stats or features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div
                className={`text-center p-4 rounded-xl ${
                  lightBg
                    ? "bg-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <p
                  className={`text-3xl font-bold ${
                    lightText ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  98%
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkText ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Accuracy
                </p>
              </div>
              <div
                className={`text-center p-4 rounded-xl ${
                  lightBg
                    ? "bg-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <p
                  className={`text-3xl font-bold ${
                    lightText ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  24/7
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkText ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Support
                </p>
              </div>
              <div
                className={`text-center p-4 rounded-xl ${
                  lightBg
                    ? "bg-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <p
                  className={`text-3xl font-bold ${
                    lightText ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  Fast
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkText ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Detection
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            className={`${
              imgStart ? "lg:order-1" : "lg:order-2"
            } relative group`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent z-10 group-hover:from-emerald-500/30 transition-all duration-500"></div>
              
              {/* Image */}
              <img
                src={img}
                alt={alt}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
