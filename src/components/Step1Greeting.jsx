import React from "react";
import { motion } from "motion/react";
import { SparkleIcon, containerVariants } from "./SharedElements";
import { SplitText } from "./SplitText";

export const Step1Greeting = ({ nextStep }) => (
  <motion.div
    key="step-1"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex flex-col py-10 items-center justify-center z-10 max-w-3xl px-6 text-center"
  >
    <div className="space-y-12 flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <SparkleIcon className="w-10 h-10 text-indigo-400 mb-2 mx-auto drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
      </motion.div>

      <div className="flex flex-col gap-6 w-full justify-center items-center">
        <SplitText
          text="जन्मदिन की ढेरों शुभकामनाएँ captain 😎 🎉"
          type="word"
          delay={0.5}
          className="text-4xl flex justify-center items-center md:text-6xl font-semibold text-white bg-clip-text bg-linear-to-r from-pink-300 to-indigo-300 drop-shadow-md pb-2"
        />

        <SplitText
          text="सोचा आज तुम्हारी थोड़ी तारीफ कर दूँ… फिर याद आया — झूठ बोलना पाप है 🤭😂 cute है… (चलो आज birthday है इसलिए इतना झूठ allowed है 😜) भगवान करे तुझे दुनिया की सारी खुशियाँ मिलें… और मुझे तेरी हर पार्टी की free treat 🍕🍔🎂 वैसे gift ready है… पहले confession करो— हमारी पुरानी शरारतों में mastermind कौन था? 😏 आज roast भी होगा,memories refresh भी होंगी, और cake भी बचेगा नहीं 🤣 और हाँ… तैयार हो अपने birthday surprise के लिए…"
          type="word"
          delay={1.5}
          className="text-xl flex justify-center items-center md:text-3xl text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        className="pt-8"
      >
        <button
          onClick={nextStep}
          className="group relative cursor-pointer px-10 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] overflow-hidden flex items-center gap-3 backdrop-blur-md"
        >
          <span className="relative z-10">Let's Go</span>
          <span className="relative z-10 text-pink-400 group-hover:translate-x-1 transition-transform">
            →
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-pink-500/20 to-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        </button>
      </motion.div>
    </div>
  </motion.div>
);
