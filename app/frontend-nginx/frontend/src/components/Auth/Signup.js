import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation, Trans } from "react-i18next";
import { axiosInstance } from "../../axios.config";
import { signup } from "../../store/features/userSlice";
import { useDispatch } from "react-redux";

const phoneRegex = /^\d{10}$/;
let schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  username: yup.string().required(),
  phone: yup
    .string()
    .required()
    .matches(phoneRegex, "Phone number is not valid"),
  password: yup.string().min(6).max(8).required(),
  type: yup.string().required(),
});

function Signup() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (data) => {
    setApiError(""); // Clear previous errors
    setIsLoading(true);
    
    axiosInstance
      .post("auth/account", data)
      .then((response) => {
        dispatch(signup(response.data.user));
        navigate("/disease-detection");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          // Server responded with error
          if (error.response.status === 409) {
            setApiError("This email/username is already registered. Please use a different one or try logging in.");
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
        console.error("Signup error:", error);
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  console.log(errors);

  return (
    <form
      className="space-y-4"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">
              {t("description.auth.4")} <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="firstName"
              className={`w-full px-3 py-2.5 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm ${
                errors && errors.firstName
                  ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                  : "border-gray-200 focus:border-emerald-500 focus:bg-white"
              }`}
              placeholder="First name"
              {...register("firstName")}
            />
          </label>
          {errors && errors.firstName ? (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.firstName.message}
            </p>
          ) : null}
        </div>
        
        <div>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">
              {t("description.auth.5")} <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="lastName"
              className={`w-full px-3 py-2.5 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm ${
                errors && errors.lastName
                  ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                  : "border-gray-200 focus:border-emerald-500 focus:bg-white"
              }`}
              placeholder="Last name"
              {...register("lastName")}
            />
          </label>
          {errors && errors.lastName ? (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>
      
      <div>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            {t("description.auth.0")} <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            name="username"
            className={`w-full px-4 py-2.5 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm ${
              errors && errors.username
                ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                : "border-gray-200 focus:border-emerald-500 focus:bg-white"
            }`}
            placeholder="Enter email or username"
            {...register("username")}
          />
        </label>
        {errors && errors.username ? (
          <p className="text-red-500 text-xs mt-1 ml-1">
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
            className={`w-full px-4 py-2.5 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm ${
              errors && errors.password
                ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                : "border-gray-200 focus:border-emerald-500 focus:bg-white"
            }`}
            placeholder="Minimum 6 characters"
            {...register("password")}
          />
        </label>
        {errors && errors.password ? (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">
              {t("description.auth.6")} <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="phone"
              className={`w-full px-3 py-2.5 bg-gray-50 border-2 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm ${
                errors && errors.phone
                  ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                  : "border-gray-200 focus:border-emerald-500 focus:bg-white"
              }`}
              placeholder="10-digit phone"
              {...register("phone")}
            />
          </label>
          {errors && errors.phone ? (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </span>
            <select
              name="type"
              id="type"
              defaultValue="farmer"
              className={`w-full px-3 py-2.5 bg-gray-50 border-2 rounded-lg focus:outline-none transition-all duration-200 text-sm ${
                errors && errors.type
                  ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                  : "border-gray-200 focus:border-emerald-500 focus:bg-white"
              }`}
              {...register("type")}
            >
              <option value="farmer">{t("description.auth.7")}</option>
              <option value="expert">{t("description.auth.8")}</option>
            </select>
          </label>
          {errors && errors.type ? (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.type.message}
            </p>
          ) : null}
        </div>
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
              Creating Account...
            </span>
          ) : (
            t("description.auth.2")
          )}
        </button>
      </div>
    </form>
  );
}export default Signup;
