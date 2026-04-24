import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import audioManager from "../utils/audioManager";

import { Step0Invitation } from "./Step0Invitation";
import { Step1Greeting } from "./Step1Greeting";
import { Step2Cake } from "./Step2Cake";
import { Step3Teaser } from "./Step3Teaser";
import { Step4Finale } from "./Step4Finale";

// Countdown component shown between Step 0 and Step 1
const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      key="countdown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center z-10"
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-500/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: 160, height: 160, top: -30, left: -30 }}
            />
            <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-[0_0_40px_rgba(236,72,153,0.5)]">
              {count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-neutral-400 text-sm md:text-base tracking-widest uppercase"
      >
        Get Ready...
      </motion.p>
    </motion.div>
  );
};

export default function BirthdayGreeting() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCakeCut, setIsCakeCut] = useState(false);

  // Play birthday music starting from countdown
  useEffect(() => {
    if (showCountdown) {
      audioManager.play("birthday");
    }
  }, [showCountdown]);

  // Pause birthday song when leaving this page
  useEffect(() => {
    return () => {
      audioManager.pause("birthday");
    };
  }, []);

  // When gift is tapped, show countdown instead of going directly to step 1
  const handleGiftTap = () => {
    setShowCountdown(true);
  };

  // When countdown finishes, move to step 1
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setStep(1);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (step === 4) {
      setShowConfetti(true);

      const duration = 10 * 1000;
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
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden flex items-center justify-center relative selection:bg-pink-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px] mix-blend-screen animate-pulse" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen"
          style={{
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && !showCountdown && <Step0Invitation nextStep={handleGiftTap} />}
        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
        {step === 1 && !showCountdown && <Step1Greeting nextStep={nextStep} />}
        {step === 2 && <Step2Cake nextStep={nextStep} isCakeCut={isCakeCut} setIsCakeCut={setIsCakeCut} />}
        {step === 3 && <Step3Teaser nextStep={nextStep} />}
        {step === 4 && <Step4Finale setStep={setStep} navigate={navigate} />}
      </AnimatePresence>
    </div>
  );
}
