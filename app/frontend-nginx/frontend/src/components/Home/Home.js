import InfoSection from "./InfoSection/InfoSection";
import { homeObjOne, homeObjTwo, homeObjThree } from "./InfoSection/Data";
import bg1 from "../../assets/images/HomePage/smart-agriculture-iot-with-hand-planting-tree-background.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MdKeyboardArrowRight, MdArrowForward } from "react-icons/md";
import { useTranslation, Trans } from "react-i18next";

const Home = () => {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };
  const { t, i18n } = useTranslation();
  homeObjOne["t"] = t("description.home", { returnObjects: true }).slice(0, 4);
  homeObjTwo["t"] = t("description.home", { returnObjects: true }).slice(4, 8);
  homeObjThree["t"] = t("description.home", { returnObjects: true }).slice(
    8,
    12
  );

  return (
    <>
      <div className="flex-row h-fit">
        <div className="col-span-12 h-fit">
          <div className="col-span-12 flex flex-row relative overflow-hidden">
            {/* Modern gradient background layers */}
            <div
              className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 rounded-r-[900px] absolute h-full shadow-2xl"
              style={{
                borderRadius: "54% 46% 100% 0% / 0% 100% 0% 100% ",
                width: "45%",
              }}
            ></div>
            <div
              className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-r-[900px] absolute h-full shadow-xl"
              style={{
                borderRadius: "45% 55% 100% 0% / 0% 100% 0% 100% ",
                width: "44%",
              }}
            ></div>
            
            {/* Hero content */}
            <div className="absolute h-full px-8 md:px-0 md:w-1/2 lg:w-2/5 text-white z-10 flex">
              <div className="my-auto ml-auto w-full md:w-4/5 flex flex-col space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit mx-auto md:mx-0">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
                  </span>
                  <span className="text-sm font-semibold">AI-Powered Crop Protection</span>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight text-center md:text-left">
                  <span className="block mb-2">{t("description.heading.0")}</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-green-200 to-emerald-200">
                    Crop Guard
                  </span>
                </h1>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-green-50 leading-relaxed text-justify md:text-left font-medium">
                  {t("description.heading.1")}
                </p>
                
                {/* CTA Button */}
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-3 bg-white text-emerald-600 rounded-full px-8 py-4 font-bold text-xl shadow-2xl hover:shadow-emerald-400/50 hover:scale-105 transform transition-all duration-300 w-fit mx-auto md:mx-0 group"
                  onMouseEnter={onHover}
                  onMouseLeave={onHover}
                >
                  <span>{t("description.heading.2")}</span>
                  {hover ? (
                    <MdArrowForward className="text-2xl group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <MdKeyboardArrowRight className="text-2xl" />
                  )}
                </Link>

                {/* Feature badges */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                    🤖 AI Detection
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                    🌱 Organic Solutions
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                    📊 Real-time Analysis
                  </div>
                </div>
              </div>
            </div>

            {/* Hero image with enhanced overlay */}
            <div
              className="ml-auto basis-full md:basis-5/6 relative"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.4) 50%, rgba(0,0,0,0.5) 100%), url(" +
                  bg1 +
                  ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "700px",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Floating stats cards */}
              <div className="absolute bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-md bg-opacity-95 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-600">98%</p>
                    <p className="text-sm text-gray-600 font-semibold">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Object.keys(lngs).map((lng) => (
        <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
          {lngs[lng].nativeName}
        </button>
        ))*/}
        <div className="col-span-12 h-fit">
          <InfoSection {...homeObjOne} />
        </div>
        <div className="col-span-12 h-fit">
          <InfoSection {...homeObjTwo} />
        </div>
        <div className="col-span-12 h-fit">
          <InfoSection {...homeObjThree} />
        </div>
      </div>
    </>
  );
};

export default Home;
