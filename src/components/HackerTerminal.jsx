import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import warningSound from "../assets/warning_sound.mp3";

// ─── Web Audio API: hacking terminal ambience ──────────────────────────────
function createHackingAmbience() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  // Master gain
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);

  // 1. Low drone hum
  const drone = ctx.createOscillator();
  drone.type = "sawtooth";
  drone.frequency.value = 55;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 180;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.15;
  drone.connect(droneFilter).connect(droneGain).connect(master);
  drone.start();

  // 2. Subtle background static
  const bufSize = ctx.sampleRate * 2;
  const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const nFilter = ctx.createBiquadFilter();
  nFilter.type = "bandpass";
  nFilter.frequency.value = 2500;
  nFilter.Q.value = 3;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.02;
  noise.connect(nFilter).connect(nGain).connect(master);
  noise.start();

  // 3. Periodic data blips (typing tick sounds)
  const timers = [];
  const scheduleBlips = () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    const count = 3 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = 1000 + Math.random() * 3000;
      const g = ctx.createGain();
      const t = now + i * (0.05 + Math.random() * 0.08);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.02, t + 0.005);
      g.gain.linearRampToValueAtTime(0, t + 0.02 + Math.random() * 0.03);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.06);
    }
    timers.push(setTimeout(scheduleBlips, 400 + Math.random() * 800));
  };
  scheduleBlips();

  // Return stop function
  return {
    stop() {
      timers.forEach(clearTimeout);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        try { drone.stop(); } catch {}
        try { noise.stop(); } catch {}
        ctx.close().catch(() => {});
      }, 700);
    },
  };
}

// ─── Fake terminal lines typed out one-by-one ─────────────────────────────
const HACK_LINES = [
  { text: "$ ./birthday_surprise --target captain", delay: 55 },
  { text: "Initializing Birthday Protocol v2.0...", delay: 40 },
  { text: "Target identified: ★ Captain ★", delay: 35 },
  { text: "", delay: 10 },
  { text: "[✓] Scanning memories database ████████████ 100%", delay: 25 },
  { text: "[✓] Loading 1000+ moments of friendship...", delay: 35 },
  { text: "[✓] Compiling all the inside jokes ██████ done", delay: 30 },
  { text: "[✓] Decrypting secret birthday wishes...", delay: 30 },
  { text: "[✓] Injecting love & happiness → heart.exe", delay: 35 },
  { text: "", delay: 10 },
  { text: "root@bestfriend:~# cat /vault/surprise.gift", delay: 50 },
  { text: "Unwrapping surprises... ████████████████ 100%", delay: 22 },
  { text: "[✓] 1 special gift found. 🎁", delay: 30 },
  { text: "", delay: 10 },
  { text: "╔══════════════════════════════════════════════╗", delay: 15 },
  { text: "║   🎂  BIRTHDAY VAULT DETECTED  🎂            ║", delay: 15 },
  { text: "║   Only the birthday girl can open this...    ║", delay: 15 },
  { text: "╚══════════════════════════════════════════════╝", delay: 15 },
  { text: "", delay: 10 },
  { text: "Enter secret password to unlock your surprise ↓", delay: 40 },
];

// ─── Skull ASCII for the danger screen ─────────────────────────────────────
const SKULL_ASCII = `
    ██████████████
  ██              ██
██    ██      ██    ██
██                  ██
██    ██      ██    ██
██                  ██
  ██   ████████   ██
    ██████████████
        ████
      ████████
`;

// ─── Sub-components ────────────────────────────────────────────────────────

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF{}[]<>/\\|";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () =>
      Math.random() * -canvas.height / fontSize
    );

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.6 + Math.random() * 0.4})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: 0.3,
        pointerEvents: "none",
      }}
    />
  );
};

const TypingLine = ({ text, onDone, typingSpeed = 30 }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!text) {
      onDone?.();
      return;
    }
    const timer = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, typingSpeed);
    return () => clearInterval(timer);
  }, [text, typingSpeed, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

// ─── Danger / Lockout Screen ────────────────────────────────────────────────
const DangerScreen = ({ onRetry }) => {
  // Play warning sound on mount, stop on unmount
  useEffect(() => {
    const audio = new Audio(warningSound);
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <motion.div
      key="danger"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0000" }}
    >
      {/* Red pulse overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(220,38,38,0.35) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)",
        }}
      />

      {/* Glitch bars */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-red-500/60 z-20"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Skull */}
      <motion.pre
        className="text-red-500 text-[10px] md:text-sm font-mono leading-tight z-30 select-none"
        animate={{ opacity: [1, 0.6, 1], scale: [1, 1.02, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {SKULL_ASCII}
      </motion.pre>

      {/* Warning text */}
      <motion.div
        className="z-30 flex flex-col items-center gap-4 mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-black text-red-500 tracking-widest uppercase"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ⚠ ACCESS DENIED ⚠
        </motion.h1>
        <p className="text-red-400/80 text-sm md:text-base font-mono tracking-wider text-center max-w-md">
          INTRUSION DETECTED — UNAUTHORIZED ACCESS ATTEMPT LOGGED
        </p>
        <p className="text-red-500/60 text-xs font-mono mt-1">
          IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.
          {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)} — TRACED
        </p>

        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-8 py-3 border border-red-500/50 text-red-400 font-mono text-sm uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer rounded"
        >
          [ RETRY ACCESS ]
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main HackerTerminal ───────────────────────────────────────────────────
const PASSWORD = "captain";

export default function HackerTerminal({ onSuccess }) {
  const [phase, setPhase] = useState("hacking"); // hacking | password | danger
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [passwordValue, setPasswordValue] = useState("");
  const [shake, setShake] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const ambienceRef = useRef(null);

  // Start hacking ambience on mount
  useEffect(() => {
    try {
      ambienceRef.current = createHackingAmbience();
    } catch {}
    return () => {
      ambienceRef.current?.stop();
      ambienceRef.current = null;
    };
  }, []);

  // Stop ambience when leaving hacking phase
  useEffect(() => {
    if (phase !== "hacking" && ambienceRef.current) {
      ambienceRef.current.stop();
      ambienceRef.current = null;
    }
  }, [phase]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  // Handle line completion
  const handleLineDone = useCallback(() => {
    const nextIdx = currentLine + 1;
    if (nextIdx < HACK_LINES.length) {
      setTimeout(() => {
        setLines((prev) => [...prev, HACK_LINES[nextIdx].text]);
        setCurrentLine(nextIdx);
      }, HACK_LINES[currentLine]?.delay * 10 || 300);
    } else {
      // All lines done → show password prompt
      setTimeout(() => setPhase("password"), 600);
    }
  }, [currentLine]);

  const hasStartedRef = useRef(false);

  // Start first line (guarded against StrictMode double-mount)
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setLines([HACK_LINES[0].text]);
    }
  }, []);

  // Focus password input when phase changes
  useEffect(() => {
    if (phase === "password" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  // Handle password submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordValue.trim().toLowerCase() === PASSWORD) {
      onSuccess();
    } else {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPhase("danger");
      }, 600);
    }
  };

  const handleRetry = () => {
    setPasswordValue("");
    setPhase("password");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "danger" ? (
        <DangerScreen onRetry={handleRetry} />
      ) : (
        <motion.div
          key="terminal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "#0a0a0a" }}
        >
          <MatrixRain />

          {/* CRT scan-line overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.02) 2px, rgba(0,255,0,0.02) 4px)",
            }}
          />

          {/* Terminal window */}
          <motion.div
            className="relative z-20 w-[94vw] max-w-2xl rounded-xl overflow-hidden shadow-2xl"
            style={{
              border: "1px solid rgba(0,255,0,0.15)",
              boxShadow: "0 0 60px rgba(0,255,0,0.08), inset 0 0 60px rgba(0,0,0,0.5)",
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ background: "rgba(0,255,0,0.06)", borderBottom: "1px solid rgba(0,255,0,0.1)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-green-500/60 text-xs font-mono tracking-wider">
                root@kali:~
              </span>
            </div>

            {/* Terminal body */}
            <div
              ref={terminalRef}
              className="p-4 md:p-6 font-mono text-xs md:text-sm overflow-y-auto"
              style={{
                background: "rgba(0,0,0,0.85)",
                height: "min(65vh, 500px)",
                color: "#00ff41",
              }}
            >
              {lines.map((line, i) => (
                <div key={i} className="mb-1 leading-relaxed" style={{ minHeight: "1.2em" }}>
                  {i === currentLine && phase === "hacking" ? (
                    <TypingLine
                      text={line}
                      typingSpeed={HACK_LINES[i]?.delay || 30}
                      onDone={handleLineDone}
                    />
                  ) : (
                    <span style={{ color: line.startsWith("[✓]") ? "#4ade80" : line.startsWith("╔") || line.startsWith("║") || line.startsWith("╚") ? "#facc15" : "#00ff41" }}>
                      {line}
                    </span>
                  )}
                </div>
              ))}

              {/* Password input */}
              <AnimatePresence>
                {phase === "password" && (
                  <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4"
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-green-400">password:~$</span>
                      <input
                        ref={inputRef}
                        type="password"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none caret-green-400 text-green-300 font-mono text-xs md:text-sm"
                        style={{ caretColor: "#4ade80" }}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <motion.span
                        className="w-2 h-4 bg-green-400"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    </motion.div>
                    <p className="text-red-500 text-[10px] mt-3 tracking-wider">
                      HINT: What do I always call you? (lowercase)
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bottom status bar */}
          <div className="fixed bottom-0 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between font-mono text-[10px] text-green-500/40"
            style={{ background: "rgba(0,0,0,0.7)", borderTop: "1px solid rgba(0,255,0,0.08)" }}
          >
            <span>SYS:ACTIVE</span>
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ● CONNECTED
            </motion.span>
            <span>ENC:AES-256</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
