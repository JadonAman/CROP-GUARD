import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { 
  FiVideo, 
  FiVideoOff, 
  FiMic, 
  FiMicOff, 
  FiPhoneCall, 
  FiPhoneOff,
  FiCopy,
  FiCheck,
  FiUsers,
  FiMonitor
} from "react-icons/fi";

const Teleconsulting = () => {
  const user = useSelector((state) => state.user.user);
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [copied, setCopied] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert("Please allow camera and microphone access to use teleconsulting");
      });

    socketRef.current.on("me", (id) => {
      setMe(id);
    });

    socketRef.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    });

    socketRef.current.on("callEnded", () => {
      setCallEnded(true);
      setCallAccepted(false);
      setReceivingCall(false);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    });
  }, []);

  const callUser = (id) => {
    if (!id || !stream) return;
    
    setIsConnecting(true);
    setCallEnded(false);
    
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socketRef.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: user?.firstName + " " + user?.lastName || "Anonymous",
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socketRef.current.once("callAccepted", (signal) => {
      setCallAccepted(true);
      setIsConnecting(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    setCallEnded(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socketRef.current.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    setIdToCall("");
    
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    
    if (socketRef.current) {
      socketRef.current.emit("callEnded");
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FiVideo className="text-5xl" />
                Teleconsulting
              </h1>
              <p className="text-emerald-100 text-lg">
                Connect with agricultural experts in real-time
              </p>
            </div>
            {user && (
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                <p className="text-sm text-emerald-100">Logged in as</p>
                <p className="text-xl font-bold">{user.firstName} {user.lastName}</p>
                <span className="text-xs bg-emerald-400 text-emerald-900 px-2 py-1 rounded-full mt-1 inline-block">
                  {user.type}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Video */}
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    You {!videoEnabled && "(Camera Off)"}
                  </div>
                  {!videoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <FiVideoOff className="text-6xl text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Remote Video */}
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  {callAccepted && !callEnded ? (
                    <>
                      <video
                        playsInline
                        ref={userVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                        {callerName || "Expert"}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <FiUsers className="text-6xl text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          {isConnecting ? "Connecting..." : "Waiting for connection"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition-all duration-300 ${
                    videoEnabled
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {videoEnabled ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full transition-all duration-300 ${
                    audioEnabled
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  title={audioEnabled ? "Mute" : "Unmute"}
                >
                  {audioEnabled ? <FiMic size={24} /> : <FiMicOff size={24} />}
                </button>

                {callAccepted && !callEnded && (
                  <button
                    onClick={leaveCall}
                    className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 hover:scale-110"
                    title="End call"
                  >
                    <FiPhoneOff size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* My ID Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <FiUsers className="text-emerald-600" />
                </div>
                Your Connection ID
              </h3>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">Share this ID with others to receive calls</p>
                <div className="bg-white rounded-lg p-3 mb-3 font-mono text-sm break-all border-2 border-emerald-300">
                  {me || "Loading..."}
                </div>
                <CopyToClipboard text={me} onCopy={handleCopy}>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    {copied ? (
                      <>
                        <FiCheck size={20} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy size={20} />
                        Copy ID
                      </>
                    )}
                  </button>
                </CopyToClipboard>
              </div>
            </div>

            {/* Call Someone */}
            {!callAccepted && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiPhoneCall className="text-blue-600" />
                  </div>
                  Make a Call
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter ID to Call
                    </label>
                    <input
                      type="text"
                      value={idToCall}
                      onChange={(e) => setIdToCall(e.target.value)}
                      placeholder="Paste expert's ID here"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-200 font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={() => callUser(idToCall)}
                    disabled={!idToCall || callAccepted || isConnecting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPhoneCall size={20} />
                    {isConnecting ? "Calling..." : "Start Call"}
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                💡 How to Use
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Copy your Connection ID and share it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Or enter someone's ID to call them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Use controls to manage video/audio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Call Modal */}
      {receivingCall && !callAccepted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-bounce">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPhoneCall className="text-5xl text-emerald-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Incoming Call
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {callerName} is calling...
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setReceivingCall(false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                >
                  <FiPhoneOff size={24} />
                  Decline
                </button>
                <button
                  onClick={answerCall}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                >
                  <FiPhoneCall size={24} />
                  Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teleconsulting;
