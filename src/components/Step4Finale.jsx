import React from "react";
import { motion } from "motion/react";
import { HeartIcon, SparkleIcon, containerVariants } from "./SharedElements";

export const Step4Finale = ({ setStep, navigate }) => (
  <motion.div
    key="step-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="flex flex-col gap-4 items-center justify-center z-10 text-center w-full px-4 py-20 relative"
  >
    {/* Professional Confetti (handled by canvas-confetti in useEffect) */}

    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.2,
      }}
      className="relative z-20 space-y-3"
    >
      <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg p-2">
        Happy Birthday!
      </h1>

      <div className="flex items-center justify-center gap-2">
        <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg p-2">
          Captain
        </h2>
        <span className="text-9xl">😎</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
      >
        <img src="/birthday_girl.jpeg" alt="birthday girl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-2 opacity-20">
          <HeartIcon className="w-40 h-40 text-pink-500" />
        </div>

        <div className="absolute -bottom-4 -left-2 opacity-20">
          <HeartIcon className="w-40 h-40 text-pink-500" />
        </div>

        <p className="text-xl md:text-2xl text-neutral-200 font-light leading-relaxed mb-8 relative z-10">
          🎂 **
          <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg p-2">
            Happy Birthday
          </span>
          मेरी सबसे प्यारी और इज्ज़तदार… पर थोड़ी शरारती मित्र** 😄
        </p>
        <p className="text-xl md:text-2xl text-neutral-200 font-light leading-relaxed mb-8 relative z-10">
          आज वो शुभ दिन है जब दुनिया को एक ऐसी दोस्त मिली, जो हँसते-हँसाते life
          को festival बना देती है ✨ तुझे wish करने बैठा था, सोचा कुछ emotional
          लिखूँ… फिर लगा birthday है, थोड़ी मस्ती तो बनती है 😜 याद है हमारी वो
          endless बातें, बिना वजह हँसना, और छोटे-छोटे moments को memories बना
          देना… सच में, तेरे साथ boring दिन भी entertaining हो जाता है 😂 भगवान
          करे तेरी जिंदगी में इतनी खुशियाँ आएँ जितनी बार तू “बस 2 मिनट” बोलकर 20
          मिनट लगाती है 🤭 तेरी smile हमेशा ऐसी ही रहे, तेरी shopping cart हमेशा
          full रहे, और wallet… खैर वो strong रहे 😅🛍️ आज birthday पर official
          announcement — तू एक साल और mature हुई है… (बाकी शरारतें देखकर
          maturity पर अभी research चल रही है 🤣) Cake अच्छे से बचा कर रखना,
          क्योंकि दोस्ती में sharing जरूरी है… और मैं “quality check” के नाम पर
          extra piece ले सकता हूँ 🎂😄 और gift? महँगा gift नहीं लाया… पर हाँ,
          lifetime free roasting और unlimited friendship already included है 😂
          दुआ है — तेरे सारे सपने पूरे हों, खुशियाँ double हों, stress zero हो,
          और हमारी friendship lifetime warranty के साथ चले ❤️
          <br />
          <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg p-2">
            **Happy Birthday Bestie!**
          </span>
          <br />
          आज celebration भी होगा, laughter bhi होगा, और पुरानी यादों की rewind
          भी 😄🎉
        </p>

        <div className="flex items-center justify-center gap-2 text-pink-400 font-medium tracking-widest uppercase text-sm mt-8">
          <SparkleIcon className="w-5 h-5" />
          <span>Tumse dosti lifetime validity ke saath aayi hai 😄❤️</span>
          <SparkleIcon className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="mt-16 flex flex-col items-center gap-6"
      >
        <button
          onClick={() => navigate("/memories")}
          className="group relative px-10 py-4 cursor-pointer rounded-full bg-linear-to-r from-pink-500 to-indigo-500 text-white font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
        >
          <span className="flex items-center gap-2 ">Open Memory Page ✨</span>
        </button>
        <button
          onClick={() => setStep(0)}
          className="text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest underline decoration-white/20 underline-offset-8"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  </motion.div>
);
