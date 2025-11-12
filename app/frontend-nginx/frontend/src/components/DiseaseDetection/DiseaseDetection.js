import { useState, useEffect, useRef } from "react";
import default_crop from "../../assets/images/DiseaseDetectionPage/crop.jpg";
import { axiosInstance } from "../../axios.config";
import { useTranslation, Trans } from "react-i18next";
import LoadingBar from "react-top-loading-bar";
import { BsSearch } from "react-icons/bs";
import { IoReloadOutline } from "react-icons/io5";

const DiseaseDetection = () => {
  const { t, i18n } = useTranslation();

  const [imageUploaded, setUploadedImage] = useState();
  const [preview, setPreview] = useState(null);
  const [isPreview, setIsPreview] = useState();
  const [location, setLocation] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [liveDetails, setLiveDetails] = useState(null);
  const [loadingLiveDetails, setLoadingLiveDetails] = useState(false);
  const ref = useRef();

  // const [isLocation, setIsLocation] = useState(false);
  const drop = useRef(null);
  useEffect(() => {
    if (!imageUploaded) {
      setPreview(undefined);
      setIsPreview(false);
      return;
    }

    const objectUrl = URL.createObjectURL(imageUploaded);
    setPreview(objectUrl);
    setIsPreview(true);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageUploaded]);

  useEffect(() => {
    position();
  }, []);
  const position = async () => {
    await navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        // setIsLocation(true);
      },
      function (err) {
        console.log(err);
      }
    );
  };
  const imageUploadHandler = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setUploadedImage(undefined);
      return;
    }
    setUploadedImage(e.target.files[0]);
  };
  useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);

    return () => {
      drop?.current?.removeEventListener("dragover", handleDragOver);
      drop?.current?.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDragOver = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDrop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    // this is required to convert FileList object to array
    if (ev.dataTransfer.items) {
      console.log(ev.dataTransfer.items);
      if (ev.dataTransfer.items["length"] === 1) {
        var file = ev.dataTransfer.items[0].getAsFile();
        if (file && file["type"].split("/")[0] !== "image") {
          return;
        }
        var image = URL.createObjectURL(file);
        setPreview(image);
        setIsPreview(true);
        return () => URL.revokeObjectURL(file);
      }
    }
  };
  const goBackHandler = () => {
    setSuccessData(false);
    setLiveDetails(null);
  };

  const fetchLiveDetails = async () => {
    try {
      setLoadingLiveDetails(true);
      if (ref.current) {
        ref.current.continuousStart();
      }
      
      const response = await axiosInstance.post('/dl/live-details', {
        diseaseLabel: successData.detection,  // Full label: "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
        diseaseName: successData.detection.split("___")[1]?.split("_").join(" ") || "Unknown",  // Human readable: "Tomato Yellow Leaf Curl Virus"
        plantName: successData.plant.commonName || successData.detection.split("___")[0]
      });
      
      if (response.data.ok) {
        setLiveDetails(response.data.data);
      } else {
        alert('Failed to fetch live details: ' + response.data.message);
      }
      
      if (ref.current) {
        ref.current.complete();
      }
      setLoadingLiveDetails(false);
    } catch (error) {
      console.error('Live Details Error:', error);
      alert('Failed to fetch live details. Please try again.');
      if (ref.current) {
        ref.current.complete();
      }
      setLoadingLiveDetails(false);
    }
  };

  const downloadPDF = async () => {
    try {
      ref.current.continuousStart();
      
      // Prepare PDF data with live details if available
      const pdfData = {
        plantName: successData.plant.commonName || successData.detection.split("___")[0],
        scientificName: successData.plant.scientificName || "Unknown",
        diseaseName: successData.detection.split("___")[1]?.split("_").join(" ") || "Unknown Disease",
        isHealthy: successData.detection.toLowerCase().includes('healthy'),
        symptoms: successData.disease.symptoms || "No symptoms information available",
        causes: successData.disease.causes || successData.disease.trigger || "No causes information available",
        treatment: successData.disease.treatment || successData.disease.organic || "No treatment information available",
        prevention: successData.disease.prevention || "Practice good agricultural hygiene and crop rotation"
      };

      // Add live details if available
      if (liveDetails) {
        pdfData.liveDetails = {
          trigger: liveDetails.trigger || null,
          organicControl: liveDetails.organic_control || null,
          chemicalControl: liveDetails.chemical_control || null,
          preventiveMeasures: liveDetails.preventive_measures || null,
          additionalInfo: liveDetails.additional_info || [],
          recommendedProducts: liveDetails.recommended_products || [],
          source: liveDetails.source || "Live Data",
          fetchedAt: liveDetails.fetched_at || null
        };
      }

      const response = await fetch('http://localhost:8083/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `disease_report_${successData.plant.commonName}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      ref.current.complete();
    } catch (error) {
      console.error('PDF Download Error:', error);
      alert('Failed to download PDF report. Please try again.');
      ref.current.complete();
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (preview === undefined) {
      return;
    }
    ref.current.continuousStart();

    /* if(location === null){
      position();
      return;
    }*/

    var data = new FormData();

    data.append("image", imageUploaded);
    axiosInstance
      .post("/dl/detection", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        console.log(response);
        setSuccessData(response.data);
        
        // Save detection to user's history
        try {
          const plantName = response.data.detection.split("___")[0];
          const diseaseName = response.data.detection.split("___")[1]?.split("_").join(" ") || "Unknown";
          
          await axiosInstance.post("/detection/save-my-detection", {
            plant: plantName,
            disease: diseaseName
          });
          console.log("Detection saved to history");
        } catch (saveError) {
          console.error("Failed to save detection:", saveError);
          // Don't block the UI if saving fails
        }
        
        ref.current.complete();
      })
      .catch((error) => {
        console.log(error);
        ref.current.complete();
      });
  };
  return (
    <>
      <LoadingBar color="#10b981" ref={ref} height="4px" />
      {!successData && (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Crop Guard
                </span>{" "}
                Disease Detection
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("description.diseaseDetection.0")}
              </p>
            </div>

            <form action="#" method="POST" onSubmit={submitForm}>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
                {/* Image Preview Section */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-center items-center min-h-[300px]">
                      {!isPreview && (
                        <div className="text-center">
                          <img
                            src={default_crop}
                            className="mx-auto rounded-xl opacity-40 max-h-64 object-cover"
                            alt="Default"
                          />
                          <p className="text-red-500 font-semibold mt-4 text-sm">
                            {t("description.diseaseDetection.1")}
                          </p>
                        </div>
                      )}
                      {isPreview && (
                        <div className="relative group">
                          <img
                            src={preview}
                            className="rounded-xl shadow-lg max-h-96 object-contain"
                            alt="Preview"
                          />
                          <div className="absolute inset-0 bg-emerald-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                              ✓ Ready to Analyze
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="p-8">
                  <label className="block text-lg font-bold text-gray-800 mb-4">
                    📤 {t("description.diseaseDetection.2")}
                  </label>
                  <div
                    ref={drop}
                    className="relative border-4 border-dashed border-emerald-300 rounded-2xl p-12 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-500 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-10 h-10 text-emerald-600"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <span>{t("description.diseaseDetection.3")}</span>
                          <input
                            id="file-upload"
                            onChange={imageUploadHandler}
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-gray-600 font-medium">
                        {t("description.diseaseDetection.4")}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF • {t("description.diseaseDetection.5")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="px-8 pb-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <BsSearch className="text-xl" />
                    {t("description.diseaseDetection.6")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {successData && (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header with Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🔬 Detection Results
                  </h2>
                  <p className="text-gray-600">
                    Analysis completed successfully
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={goBackHandler}
                  >
                    <IoReloadOutline size={20} />
                    {t("description.diseaseDetection.7")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={downloadPDF}
                  >
                    📄 Download PDF
                  </button>
                  {!successData.detection.toLowerCase().includes('healthy') && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={fetchLiveDetails}
                      disabled={loadingLiveDetails}
                    >
                      {loadingLiveDetails ? "⏳ Loading..." : "🌐 Get Live Details"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Plant Info Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🌱 Plant Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4 py-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Crop Name
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {successData.detection.split("__")[0]}
                    </p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4 py-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Scientific Name
                    </p>
                    <p className="text-lg font-bold text-gray-900 italic">
                      {successData.plant.scientificName}
                    </p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4 py-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Description
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {successData.plant.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disease Info Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${successData.detection.toLowerCase().includes('healthy') ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'} p-6`}>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {successData.detection.toLowerCase().includes('healthy') ? '✅ Plant Status' : '🦠 Disease Detected'}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className={`border-l-4 ${successData.detection.toLowerCase().includes('healthy') ? 'border-green-500' : 'border-red-500'} pl-4 py-2`}>
                    <p className="text-sm font-semibold text-gray-600">
                      {successData.detection.toLowerCase().includes('healthy') ? 'Status' : 'Disease Name'}
                    </p>
                    <p className={`text-lg font-bold ${successData.detection.toLowerCase().includes('healthy') ? 'text-green-600' : 'text-red-600'}`}>
                      {successData.detection
                        .split("__")[1]
                        .split("_")
                        .join(" ")}
                    </p>
                  </div>
                  {!successData.detection.toLowerCase().includes('healthy') && (
                    <>
                      <div className="border-l-4 border-orange-500 pl-4 py-2">
                        <p className="text-sm font-semibold text-gray-600">
                          Symptoms
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {successData.disease.symptoms || "No symptoms - plant is healthy"}
                        </p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <p className="text-sm font-semibold text-gray-600">
                          Trigger / Cause
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {successData.disease.trigger || successData.disease.causes || "No disease detected"}
                        </p>
                      </div>
                    </>
                  )}
                  {successData.detection.toLowerCase().includes('healthy') && (
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="text-sm font-semibold text-gray-600">
                        Health Assessment
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        🎉 Great news! Your plant appears to be healthy with no visible signs of disease. Continue maintaining good agricultural practices to keep it healthy.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Treatment Methods - Only show if not healthy */}
            {!successData.detection.toLowerCase().includes('healthy') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Organic Method */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      🌿 Organic Control Method
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {successData.disease.organic || "Treatment information not available in database. Click 'Get Live Details' for treatment recommendations."}
                    </p>
                  </div>
                </div>

                {/* Chemical Method */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      🧪 Chemical Control Method
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {successData.disease.chemical || "Treatment information not available in database. Click 'Get Live Details' for treatment recommendations."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Live Details Section */}
            {liveDetails && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      🌐 Live Details from Internet
                    </h3>
                    <span className="text-xs text-gray-600 bg-white px-4 py-2 rounded-full shadow">
                      Source: {liveDetails.source || "Plantix.net"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Fetched: {new Date(liveDetails.fetched_at).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trigger Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
                      <h4 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
                        🎯 What Causes This
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {liveDetails.trigger || "Information not available"}
                      </p>
                    </div>

                    {/* Prevention Tips */}
                    {liveDetails.preventive_measures && (
                      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                          🛡️ Prevention Tips
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {liveDetails.preventive_measures}
                        </p>
                      </div>
                    )}

                    {/* Organic Control */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                      <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                        🌱 Organic Control
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {liveDetails.organic_control ||
                          "No organic control info available"}
                      </p>
                    </div>

                    {/* Chemical Control */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                      <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                        🧪 Chemical Control
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {liveDetails.chemical_control ||
                          "No chemical control info available"}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Products */}
                  {liveDetails.recommended_products &&
                    liveDetails.recommended_products.length > 0 && (
                      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">
                          🛒 Recommended Products
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {liveDetails.recommended_products.map(
                            (product, index) => (
                              <div
                                key={index}
                                className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 hover:shadow-md transition-all"
                              >
                                <p className="font-bold text-orange-700">
                                  {product.name || product}
                                </p>
                                {product.type && (
                                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full mt-2 inline-block">
                                    {product.type}
                                  </span>
                                )}
                                {product.description && (
                                  <p className="text-xs text-gray-600 mt-2">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Additional Info */}
                  {liveDetails.additional_info && liveDetails.additional_info.length > 0 && (
                    <div className="mt-6 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 shadow-lg">
                      <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        💡 Additional Information
                      </h4>
                      {liveDetails.additional_info.map((info, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          {info.title && (
                            <h5 className="font-semibold text-yellow-700 mb-2">
                              {info.title}
                            </h5>
                          )}
                          <p className="text-gray-700 leading-relaxed">
                            {info.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default DiseaseDetection;
