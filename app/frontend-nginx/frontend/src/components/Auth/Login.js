import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios.config";
import { login } from "../../store/features/userSlice";
import { useDispatch } from "react-redux";
import { useTranslation, Trans } from "react-i18next";

let schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(6).max(8).required(),
});

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (data) => {
    setApiError(""); // Clear previous errors
    setIsLoading(true);
    
    axiosInstance
      .post("/auth/login", data)
      .then((response) => {
        dispatch(login(response.data.user));
        navigate("/disease-detection");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          // Server responded with error
          if (error.response.status === 401) {
            setApiError("Invalid username or password. Please try again.");
          } else if (error.response.status === 404) {
            setApiError("User not found. Please check your username or sign up.");
          } else if (error.response.status === 400) {
            setApiError(error.response.data.message || "Invalid data provided. Please check your inputs.");
          } else {
            setApiError("Something went wrong. Please try again later.");
          }
        } else if (error.request) {
          // Request made but no response
          setApiError("Cannot connect to server. Please check your internet connection.");
        } else {
          setApiError("An unexpected error occurred. Please try again.");
        }
        console.error("Login error:", error);
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form
      className="space-y-5"
      autoComplete="true"
      onSubmit={handleSubmit(submitHandler)}
    >
      {/* Error Alert */}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-red-800">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={() => setApiError("")}
              className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            {t("description.auth.0")} <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            name="username"
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 ${
              errors && errors.username
                ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                : "border-gray-200 focus:border-emerald-500 focus:bg-white"
            }`}
            placeholder="Enter email or username"
            {...register("username")}
          />
        </label>
        {errors && errors.username ? (
          <p className="text-red-500 text-sm mt-1 ml-1">
            {errors.username.message}
          </p>
        ) : null}
      </div>
      
      <div>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            {t("description.auth.1")} <span className="text-red-500">*</span>
          </span>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 ${
              errors && errors.password
                ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                : "border-gray-200 focus:border-emerald-500 focus:bg-white"
            }`}
            placeholder="Enter your password"
            {...register("password")}
          />
        </label>
        {errors && errors.password ? (
          <p className="text-red-500 text-sm mt-1 ml-1">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.02]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            t("description.auth.3")
          )}
        </button>
      </div>
    </form>
  );
}

export default Login;
