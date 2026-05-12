import React from "react";
import { motion } from "motion/react";
import { GiftIcon, SparkleIcon, containerVariants } from "./SharedElements";

const FloatingParticle = ({ delay, x, y, size, color }) => (
  <motion.div
    className={`absolute rounded-full ${color}`}
    style={{ width: size, height: size }}
    initial={{ opacity: 0, x, y, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      y: [y, y - 80],
      scale: [0, 1, 0.5],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const Step0Invitation = ({ nextStep }) => (
  <motion.div
    key="step-0"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex flex-col gap-4 items-center justify-center z-10 p-8 relative"
  >


    <div className="flex items-center justify-center gap-2">
      <h2 className="text-3xl text-center md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg p-2">
        Hi Captain
      </h2>
    </div>

    {/* Floating particles around the gift */}
    <div className="absolute inset-0 pointer-events-none">
      <FloatingParticle delay={0} x={-60} y={40} size={6} color="bg-pink-400" />
      <FloatingParticle
        delay={0.5}
        x={70}
        y={20}
        size={8}
        color="bg-indigo-400"
      />
      <FloatingParticle
        delay={1}
        x={-40}
        y={-30}
        size={5}
        color="bg-purple-400"
      />
      <FloatingParticle
        delay={1.5}
        x={50}
        y={-50}
        size={7}
        color="bg-rose-300"
      />
      <FloatingParticle
        delay={2}
        x={-80}
        y={-10}
        size={4}
        color="bg-cyan-400"
      />
      <FloatingParticle
        delay={0.8}
        x={90}
        y={50}
        size={6}
        color="bg-amber-300"
      />
      <FloatingParticle
        delay={2.2}
        x={-20}
        y={60}
        size={5}
        color="bg-pink-300"
      />
      <FloatingParticle
        delay={1.2}
        x={30}
        y={-60}
        size={4}
        color="bg-indigo-300"
      />
    </div>

    {/* Animated outer rings */}
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border border-pink-500/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-indigo-500/20"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* The Gift Button */}
      <motion.button
        onClick={nextStep}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          boxShadow: [
            "0 0 30px rgba(236,72,153,0.3)",
            "0 0 60px rgba(129,140,248,0.4)",
            "0 0 30px rgba(236,72,153,0.3)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative group flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full bg-linear-to-tr from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out cursor-pointer"
      >
        <div className="absolute inset-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md flex items-center justify-center overflow-hidden">
          {/* Inner shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3,
            }}
          />
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          >
            <GiftIcon className="w-14 h-14 text-pink-300 group-hover:text-pink-200 transition-colors drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]" />
          </motion.div>
        </div>
      </motion.button>
    </div>

    {/* Text below */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="mt-10 flex flex-col items-center gap-3 text-center"
    >
      <p className="text-neutral-300 text-base md:text-lg tracking-widest uppercase font-medium flex items-center gap-2">
        <SparkleIcon className="w-4 h-4 text-pink-400" />
        Tap to open your surprise
        <SparkleIcon className="w-4 h-4 text-indigo-400" />
      </p>
      <motion.p
        className="text-neutral-500 text-xs md:text-sm tracking-wide"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        A little something special awaits ✨
      </motion.p>
    </motion.div>
  </motion.div>
);
