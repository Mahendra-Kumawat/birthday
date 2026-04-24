import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SparkleIcon, containerVariants } from "./SharedElements";

const funnyJokes = [
  "उम्र बढ़ रही है तेरी, पर अक्ल अभी भी वही है! 😂",
  "Happy Birthday! अब तू officially बूढ़ी हो गई 🤣",
  "केक खा ले, डाइट कल से... फिर कभी नहीं! 🍰",
  "तेरी उम्र का केक बनाते तो candles से आग लग जाती! 🔥",
];

const CakeSlice = ({ side, isCakeCut }) => {
  const isLeft = side === "left";
  return (
    <motion.div
      animate={
        isCakeCut
          ? { x: isLeft ? -35 : 35, rotate: isLeft ? -10 : 10, y: 8 }
          : { x: 0, rotate: 0, y: 0 }
      }
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className={`relative w-28 h-28 md:w-36 md:h-36 ${isLeft ? "bg-pink-500 rounded-tl-3xl rounded-bl-md origin-bottom-right z-10" : "bg-pink-600 rounded-tr-3xl rounded-br-md origin-bottom-left z-0 -ml-px"} shadow-2xl`}
    >
      {/* Icing drips */}
      <div
        className={`absolute top-0 left-0 w-full h-10 ${isLeft ? "bg-rose-400 rounded-tl-3xl" : "bg-rose-500 rounded-tr-3xl"}`}
      />
      <div
        className={`absolute ${isLeft ? "-bottom-3 right-2" : "-bottom-4 left-2"} w-6 h-8 ${isLeft ? "bg-rose-400" : "bg-rose-500"} rounded-b-full`}
      />
      <div
        className={`absolute ${isLeft ? "-bottom-2 left-4 w-4 h-6" : "-bottom-2 right-4 w-5 h-7"} ${isLeft ? "bg-rose-400" : "bg-rose-500"} rounded-b-full`}
      />

      {/* Sprinkles */}
      <div className="absolute top-12 left-3 w-1.5 h-3 bg-yellow-300 rounded-full rotate-45" />
      <div className="absolute top-14 right-5 w-1.5 h-3 bg-cyan-300 rounded-full -rotate-30" />
      <div className="absolute top-16 left-8 w-1.5 h-3 bg-green-300 rounded-full rotate-12" />

      {/* Filling layers */}
      <div className="absolute top-1/2 left-0 w-full h-3 bg-yellow-200" />
      <div className="absolute top-[65%] left-0 w-full h-2 bg-amber-100/50" />

      {/* Candle */}
      <div
        className={`absolute -top-12 ${isLeft ? "right-6" : "left-6"} w-3 h-14 bg-linear-to-t from-white to-pink-50 rounded-sm shadow-inner`}
      >
        {/* Stripe on candle */}
        <div className="absolute top-2 left-0 w-full h-1 bg-pink-200/50" />
        <div className="absolute top-5 left-0 w-full h-1 bg-pink-200/50" />
        <AnimatePresence>
          {!isCakeCut && (
            <motion.div
              exit={{ opacity: 0, scale: 0, y: -10 }}
              className="absolute -top-7 -left-1.5 w-6 h-8 origin-bottom"
            >
              {/* Outer flame */}
              <motion.div
                animate={{ scaleY: [1, 1.2, 0.9, 1], scaleX: [1, 0.9, 1.1, 1] }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-orange-400 rounded-full blur-[1px]"
                style={{ borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%" }}
              >
                {/* Inner bright flame */}
                <div className="absolute bottom-1 left-1.5 w-3 h-4 bg-yellow-300 rounded-full opacity-90" />
              </motion.div>
              {/* Glow */}
              <div className="absolute -inset-2 bg-orange-300/20 rounded-full blur-md" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CakeCrumbs = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0.5],
          x: (Math.random() - 0.5) * 120,
          y: [0, -40 - Math.random() * 60],
        }}
        transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
          ["bg-pink-400", "bg-yellow-300", "bg-rose-300", "bg-amber-200"][i % 4]
        }`}
      />
    ))}
  </div>
);

export const Step2Cake = ({ nextStep, isCakeCut, setIsCakeCut }) => {
  const [jokeIndex, setJokeIndex] = useState(0);
  const [showCrumbs, setShowCrumbs] = useState(false);

  // Cycle through jokes
  useEffect(() => {
    const timer = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % funnyJokes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCut = () => {
    setIsCakeCut(true);
    setShowCrumbs(true);
  };

  return (
    <motion.div
      key="step-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col pt-20 items-center justify-center z-10 w-full max-w-2xl px-4 text-center pb-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border  border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-xl w-full relative overflow-hidden"
      >
        {/* Shimmer bg */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
        />

        <SparkleIcon className="w-8 h-8 text-pink-400 mb-3 mx-auto opacity-70" />

        <motion.h3
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-rose-300 mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂 केक का टाइम! 🎂
        </motion.h3>
        <p className="text-neutral-400 text-sm mb-6">
          Make a wish & cut the cake!
        </p>

        {/* Rotating Jokes */}
        <div className="min-h-[70px] flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={jokeIndex}
              initial={{ opacity: 0, y: 15, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -15, rotateX: 30 }}
              transition={{ duration: 0.5 }}
              className="text-pink-200 text-lg md:text-xl mb-10 md:mb-16 italic font-light px-4"
            >
              "{funnyJokes[jokeIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Cake */}
        <div className="py-10 flex justify-center items-end relative h-52 mb-6">
          {/* Plate */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 h-4 bg-neutral-700/50 rounded-full blur-sm" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-64 h-3 bg-neutral-600/30 rounded-full" />

          <CakeSlice side="left" isCakeCut={isCakeCut} />
          <CakeSlice side="right" isCakeCut={isCakeCut} />

          {showCrumbs && <CakeCrumbs />}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col items-center min-h-[80px]">
          <AnimatePresence mode="wait">
            {!isCakeCut ? (
              <motion.button
                key="cut-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleCut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="group relative px-10 py-4 rounded-full bg-linear-to-r from-pink-500 to-rose-500 text-white font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(244,114,182,0.4)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  🔪 केक काटो!
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="next-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.p
                  className="text-pink-300 font-medium text-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: 2 }}
                >
                  बहुत खूब! परफेक्ट slice! 🍰✨
                </motion.p>
                <p className="text-neutral-400 text-sm italic">
                 केक संभाल के रखना… मैं दोस्त कम, certified cake chor ज्यादा हूँ 😈🎂
                </p>
                <button
                  onClick={nextStep}
                  className="group relative cursor-pointer mt-2 px-10 py-3 rounded-full border border-white/20 hover:border-pink-400/50 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-widest text-sm flex items-center gap-3 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                >
                  आगे चलो{" "}
                  <span className="text-pink-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
