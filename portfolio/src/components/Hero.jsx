import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  ArrowDown,
  Star,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import myPhoto from "../assets/nahom.png";

const Hero = () => {
  const [cvInfo, setCvInfo] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch CV info on component mount
  useEffect(() => {
    const fetchCVInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cv");
        if (response.ok) {
          const data = await response.json();
          setCvInfo(data);
        }
      } catch (error) {
        console.error("Error fetching CV info:", error);
      }
    };
    fetchCVInfo();
  }, []);

  // Handle CV download
  const handleDownloadCV = async (e) => {
    e.preventDefault();
    setIsDownloading(true);

    try {
      const response = await fetch("http://localhost:5000/download-cv");
      if (!response.ok) {
        throw new Error("Failed to download CV");
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'cv.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
        }
      } else if (cvInfo?.filename) {
        filename = cvInfo.filename;
      }
      
      // Create a temporary URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  const stats = [
    { number: "10+", label: "Projects", icon: <Trophy className="w-4 h-4" /> },
    { number: "4th", label: "Year SE", icon: <Sparkles className="w-4 h-4" /> },
    { number: "3+", label: "Years", icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <section
      id="home"
      className="min-h-0 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans pt-8 lg:pt-12"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left relative z-10 pt-10 lg:pt-0"
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-dark-400/80 backdrop-blur-lg rounded-full px-3 py-1.5 mb-8 border border-gray-200 dark:border-gray-700 shadow-md font-sans"
            >
              <div className="relative">
                <Sparkles className="w-3 h-3 text-primary-500 animate-pulse" />
                <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                4th-Year Software Engineering Student @ Wachemo University
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 font-sans"
            >
              Hello, I'm Nahom Maru Shiferaw
            </motion.h2>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-4 font-sans"
            >
              <span className="block text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Fullstack
              </span>
              <span className="block bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                Developer
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl leading-relaxed font-sans"
            >
              Fourth-year Software Engineering student at Wachemo University and Fullstack Developer. I build scalable, modern fullstack web applications and robust digital systems, blending modern frontend design with powerful backend engineering.
            </motion.p>

            {/* Buttons - Consolidated for parallel display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-3 justify-center lg:justify-start mb-8 max-w-lg lg:max-w-none mx-auto"
            >
              {/* Start a Project */}
              <motion.a
                href="mailto:Nahummaru9@gmail.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-primary-600 to-primary-400 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-primary-500/25 transition-all duration-300 font-sans flex-1 min-w-[150px]"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Start a Project</span>
              </motion.a>

              {/* Download CV */}
              <motion.button
                onClick={handleDownloadCV}
                disabled={isDownloading}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group border-2 border-gray-300 dark:border-dark-300 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 hover:border-primary-500 hover:bg-primary-500/5 transition-all duration-300 font-sans flex-1 min-w-[150px] ${
                  isDownloading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-700 dark:border-gray-300 border-t-transparent rounded-full animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Download CV</span>
                  </>
                )}
              </motion.button>

              {/* Telegram Channel / Chat */}
              <motion.a
                href="https://t.me/Ab_nainem21"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#0088cc] hover:bg-[#0077b5] text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 shadow-lg transition-all duration-300 font-sans flex-1 min-w-[150px]"
              >
                <SiTelegram className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Telegram @Ab_nainem21</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-4 max-w-sm font-sans"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                    <div className="text-primary-500 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 lg:mt-0 z-20 flex justify-center items-center"
          >
            {/* Ambient Background Glow behind portrait */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-primary-500/20 dark:bg-primary-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Image Container with Soft Bottom Fade */}
            <div 
              className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[420px] mx-auto group flex justify-center"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
              }}
            >
              <motion.img
                src={myPhoto}
                alt="Nahom Maru Shiferaw"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02] drop-shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-sans"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-1 text-gray-500 dark:text-gray-400 group cursor-pointer"
          >
            <span className="text-xs font-medium group-hover:text-primary-500 transition-colors duration-300">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-4 h-4 group-hover:text-primary-500 transition-colors duration-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
