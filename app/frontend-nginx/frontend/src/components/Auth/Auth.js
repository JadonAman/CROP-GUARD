import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import Login from "./Login";
import Signup from "./Signup";
import cropbg from "../../assets/images/LoginSignupPage/background4.png";

import { useTranslation, Trans } from "react-i18next";

function Auth() {
  const { t, i18n } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-blend-darken relative overflow-hidden"
      style={{
        backgroundImage: "url(" + cropbg + ")",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Left gradient waves */}
      <div
        className="bg-gradient-to-r from-emerald-700 to-emerald-600 absolute h-full"
        style={{
          borderRadius: "0 100% 100% 0 / 0 50% 50% 0",
          width: "45%",
          left: 0,
        }}
      ></div>
      <div
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 absolute h-full"
        style={{
          borderRadius: "0 100% 100% 0 / 0 50% 50% 0",
          width: "42%",
          left: 0,
          opacity: 0.9,
        }}
      ></div>
      
      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Crop Guard</h1>
            <p className="text-emerald-50 text-sm">Smart Agriculture Disease Detection</p>
          </div>
          
          {/* Toggle Switch */}
          <div className="flex justify-center py-6 bg-gray-50">
            <Switch checked={enabled} onChange={setEnabled}>
              <span className="bg-gray-300 rounded-full h-12 w-64 flex relative shadow-sm">
                <span
                  className={`mr-auto flex justify-center items-center h-full w-1/2 rounded-full transition-all duration-300 text-sm font-medium ${
                    !enabled ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {t("description.auth.2")}
                </span>
                <span
                  className={`absolute flex justify-center items-center h-full w-1/2 rounded-full transition-all duration-300 transform bg-emerald-500 text-white font-semibold shadow-md ${
                    enabled ? "translate-x-full" : ""
                  }`}
                >
                  {enabled ? t("description.auth.3") : t("description.auth.2")}
                </span>
                <span
                  className={`ml-auto flex justify-center items-center h-full w-1/2 rounded-full transition-all duration-300 text-sm font-medium ${
                    enabled ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {t("description.auth.3")}
                </span>
              </span>
            </Switch>
          </div>
          
          {/* Form Area */}
          <div className="px-8 pb-8">
            {enabled ? <Login /> : <Signup />}
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center text-white text-sm mt-6 drop-shadow-lg">
          Secure local authentication • No third-party services
        </p>
      </div>
    </div>
  );
}

export default Auth;
