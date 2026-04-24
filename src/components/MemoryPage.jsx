import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { allImages } from "../constants/images";
import audioManager from "../utils/audioManager";

export default function MemoryPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // Switch audio: pause birthday song, play memory song
  useEffect(() => {
    audioManager.pause("birthday");
    audioManager.play("memory");
    return () => {
      audioManager.pause("memory");
    };
  }, []);

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: ["#f472b6", "#c084fc", "#818cf8", "#2dd4bf", "#fbbf24"],
      });
      confetti({
        particleCount,
        startVelocity: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: ["#f472b6", "#c084fc", "#818cf8", "#2dd4bf", "#fbbf24"],
      });
    }, 250);
  }, []);

  // Navigate to prev/next image in the modal
  const currentIndex = selectedImage
    ? allImages.findIndex((m) => m.id === selectedImage.id)
    : -1;

  const goPrev = (e) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  const goNext = (e) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") goPrev(e);
      if (e.key === "ArrowRight") goNext(e);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans py-20 px-6 sm:px-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-indigo-400 mb-4 drop-shadow-sm">
            Our Best Moments
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            A little trip down memory lane. Here's to all the laughs, tears, and
            unforgettable times we've shared.
          </p>
        </motion.div>

        {/* True Masonry Layout for photos of any size */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {allImages.map((mem, idx) => {
            return (
              <motion.div
                key={mem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden group shadow-2xl break-inside-avoid mb-6 inline-block w-full cursor-pointer"
                onClick={() => setSelectedImage(mem)}
                layoutId={`memory-${mem.id}`}
              >
                <img
                  src={mem.img}
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                    🔍
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 font-medium tracking-widest uppercase text-sm inline-flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <span className="text-pink-400">←</span> Back to Start
          </button>
        </motion.div>
      </div>

      {/* Image Modal / Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              <span className="text-white text-2xl leading-none">✕</span>
            </button>

            {/* Prev button */}
            <button
              onClick={goPrev}
              className="absolute left-4 md:left-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              <span className="text-white text-2xl leading-none">←</span>
            </button>

            {/* Next button */}
            <button
              onClick={goNext}
              className="absolute right-4 md:right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              <span className="text-white text-2xl leading-none">→</span>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-neutral-300 text-sm tracking-widest">
              {currentIndex + 1} / {allImages.length}
            </div>

            {/* The image */}
            <motion.div
              layoutId={`memory-${selectedImage.id}`}
              className="relative max-w-[90vw] max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={selectedImage.img}
                className="max-w-full max-h-[85vh] object-contain rounded-3xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
