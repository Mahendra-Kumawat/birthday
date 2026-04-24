import React from "react";
import { motion } from "motion/react";
import { containerVariants } from "./SharedElements";

export const Step3Teaser = ({ nextStep }) => (
  <motion.div
    key="step-3"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex flex-col items-center justify-center z-10 max-w-2xl text-center px-4"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center"
    >
      <div className="space-y-4 mb-10">
        <p className="text-xl md:text-2xl text-neutral-300 font-light">
          केक तो कट गया... अब सोच रही होगी कोई महंगा gift मिलेगा? 😂 अरे बहन,
          expectations थोड़ा control में रखो… मैं दोस्त हूँ, ATM नहीं! 🤣
        </p>

        <p className="text-xl md:text-2xl text-pink-300 font-medium">
          Gift का तो नहीं पता… लेकिन surprise ऐसा है कि हँसी भी आएगी और पुरानी
          शरारतें भी याद आएँगी 😜🎁
        </p>
      </div>

      <button
        onClick={nextStep}
        className="relative cursor-pointer overflow-hidden group px-12 py-5 rounded-full bg-transparent border-2 border-pink-500 text-pink-300 font-semibold tracking-wider uppercase text-lg transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
      >
        <div className="absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
        <span className="relative z-10  group-hover:text-white transition-colors duration-500">
          Click Here For Surprise 👀
        </span>
      </button>
    </motion.div>
  </motion.div>
);
