import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";
import { allImages } from "../constants/images";
import audioManager from "../utils/audioManager";

/* ─── tiny shimmer placeholder ─────────────────────────────────────────── */
function Shimmer() {
  return (
    <div
      style={{
        width: "100%",
        paddingBottom: "75%",
        borderRadius: 20,
        background:
          "linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

/* ─── single gallery card ───────────────────────────────────────────────── */
function GalleryCard({ mem, idx, onClick, onImageLoad }) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onImageLoad?.(); // notify parent that this image finished loading
  };

  return (
    <motion.div
      key={mem.id}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(idx * 0.045, 1.2),
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="gallery-card"
      onClick={() => onClick(mem)}
      style={{ breakInside: "avoid", marginBottom: 16 }}
    >
      {!loaded && <Shimmer />}
      <img
        src={mem.img}
        alt={`Memory ${mem.id}`}
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "auto",
          display: loaded ? "block" : "none",
          borderRadius: 20,
          objectFit: "cover",
        }}
      />
      {/* hover overlay */}
      <div className="gallery-overlay">
        <span className="gallery-zoom">⌕</span>
        <span className="gallery-num">#{mem.id}</span>
      </div>
    </motion.div>
  );
}

/* ─── lightbox ──────────────────────────────────────────────────────────── */
function Lightbox({ image, images, onClose }) {
  const idx = images.findIndex((m) => m.id === image.id);
  const [current, setCurrent] = useState(idx);
  const [dir, setDir] = useState(0); // -1 left, 1 right

  const goPrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setDir(-1);
      setCurrent((c) => (c - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const goNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setDir(1);
      setCurrent((c) => (c + 1) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [goPrev, goNext, onClose]);

  const mem = images[current];

  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* close */}
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      {/* prev */}
      <button className="lb-btn lb-prev" onClick={goPrev} aria-label="Previous">
        ‹
      </button>

      {/* next */}
      <button className="lb-btn lb-next" onClick={goNext} aria-label="Next">
        ›
      </button>

      {/* image */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={mem.id}
          custom={dir}
          variants={{
            enter: (d) => ({ opacity: 0, x: d * 80, scale: 0.96 }),
            center: { opacity: 1, x: 0, scale: 1 },
            exit: (d) => ({ opacity: 0, x: d * -80, scale: 0.96 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="lb-img-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={mem.img} alt={`Memory ${mem.id}`} className="lb-img" />
          {/* glow ring */}
          <div className="lb-glow" />
        </motion.div>
      </AnimatePresence>

      {/* counter */}
      <div className="lb-counter">
        {current + 1} <span className="lb-sep">/</span> {images.length}
      </div>

      {/* dot strip */}
      <div className="lb-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`lb-dot${i === current ? " active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setDir(i > current ? 1 : -1);
              setCurrent(i);
            }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── main page ─────────────────────────────────────────────────────────── */
export default function MemoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const headerRef = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount >= allImages.length;

  /* increment counter whenever a card image finishes loading */
  const handleImageLoad = useCallback(() => {
    setLoadedCount((c) => c + 1);
  }, []);

  /* scroll to top on mount */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  /* audio */
  useEffect(() => {
    audioManager.pause("birthday");
    audioManager.play("memory");
    return () => audioManager.pause("memory");
  }, []);

  /* entrance confetti — fires only after every image has loaded */
  useEffect(() => {
    if (!allLoaded) return; // wait until all images are ready

    const end = Date.now() + 4000;
    const tick = setInterval(() => {
      if (Date.now() > end) return clearInterval(tick);
      const t = (end - Date.now()) / 4000;
      const count = Math.floor(40 * t);
      const colors = ["#f472b6", "#c084fc", "#818cf8", "#2dd4bf", "#fbbf24"];
      confetti({
        particleCount: count,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors,
      });
      confetti({
        particleCount: count,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors,
      });
    }, 300);
    return () => clearInterval(tick);
  }, [allLoaded]);

  const openLightbox = useCallback((mem) => setSelected(mem), []);
  const closeLightbox = useCallback(() => setSelected(null), []);

  return (
    <>
      {/* ── global styles ────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(196,130,251,0.35); }
          70%  { box-shadow: 0 0 0 16px rgba(196,130,251,0); }
          100% { box-shadow: 0 0 0 0 rgba(196,130,251,0); }
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .mem-page {
          min-height: 100vh;
          background: #080810;
          font-family: 'Inter', sans-serif;
          color: #fff;
          padding: 0 0 120px;
          position: relative;
          overflow-x: hidden;
        }

        /* ── blobs ── */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.12;
        }
        .blob-1 { width: 55vw; height: 55vw; top: -15vw; right: -10vw; background: radial-gradient(circle, #818cf8, transparent 70%); }
        .blob-2 { width: 50vw; height: 50vw; bottom: -10vw; left: -10vw; background: radial-gradient(circle, #f472b6, transparent 70%); }
        .blob-3 { width: 30vw; height: 30vw; top: 40%; left: 40%; background: radial-gradient(circle, #2dd4bf, transparent 70%); opacity: 0.07; }

        /* ── hero header ── */
        .mem-header {
          text-align: center;
          padding: 72px 24px 48px;
          position: relative;
          z-index: 10;
        }
        .mem-icon {
          font-size: 56px;
          display: block;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }
        .mem-title {
          font-size: clamp(2.2rem, 6vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f9a8d4 0%, #c084fc 45%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .mem-sub {
          color: rgba(255,255,255,0.45);
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          font-weight: 400;
          max-width: 520px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }
        .mem-count-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .mem-count-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c084fc;
          animation: pulse-ring 2s infinite;
          flex-shrink: 0;
        }

        /* ── divider ── */
        .mem-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 0 24px 48px;
        }

        /* ── masonry grid ── */
        .mem-grid {
          columns: 1;
          column-gap: 16px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
          position: relative;
          z-index: 10;
        }
        @media (min-width: 540px)  { .mem-grid { columns: 2; } }
        @media (min-width: 860px)  { .mem-grid { columns: 3; } }
        @media (min-width: 1200px) { .mem-grid { columns: 4; } }

        /* ── card ── */
        .gallery-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          background: #111120;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.35s ease;
          display: inline-block;
          width: 100%;
        }
        .gallery-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow:
            0 24px 48px rgba(0,0,0,0.55),
            0 0 0 1px rgba(196,130,251,0.25),
            0 0 40px rgba(196,130,251,0.12);
        }
        .gallery-card img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 20px;
          transition: filter 0.35s ease;
        }
        .gallery-card:hover img { filter: brightness(0.85) saturate(1.1); }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.6) 0%,
            rgba(0,0,0,0) 45%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gallery-card:hover .gallery-overlay { opacity: 1; }

        .gallery-zoom {
          font-size: 2rem;
          color: #fff;
          text-shadow: 0 2px 16px rgba(0,0,0,0.6);
          transform: scale(0.7);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .gallery-card:hover .gallery-zoom { transform: scale(1); }

        .gallery-num {
          position: absolute;
          bottom: 14px;
          right: 14px;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
          letter-spacing: 0.06em;
          background: rgba(0,0,0,0.4);
          padding: 3px 9px;
          border-radius: 100px;
          backdrop-filter: blur(6px);
        }

        /* ── lightbox ── */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(4, 4, 12, 0.92);
          backdrop-filter: blur(28px) saturate(0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lb-img-wrap {
          position: relative;
          max-width: min(90vw, 960px);
          max-height: 85vh;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 80px rgba(196,130,251,0.25),
            0 40px 80px rgba(0,0,0,0.7);
        }
        .lb-img {
          display: block;
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 24px;
        }
        .lb-glow {
          position: absolute;
          inset: -2px;
          border-radius: 26px;
          border: 1px solid rgba(196,130,251,0.3);
          pointer-events: none;
        }
        .lb-btn {
          position: fixed;
          z-index: 110;
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(16px);
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .lb-btn:hover {
          background: rgba(196,130,251,0.25);
          box-shadow: 0 0 24px rgba(196,130,251,0.3);
          transform: scale(1.1);
        }
        .lb-close { top: 20px; right: 20px; font-size: 1.1rem; }
        .lb-prev  { left: 20px;  top: 50%; transform: translateY(-50%); }
        .lb-next  { right: 20px; top: 50%; transform: translateY(-50%); }
        .lb-prev:hover { transform: translateY(-50%) scale(1.1); }
        .lb-next:hover { transform: translateY(-50%) scale(1.1); }

        .lb-counter {
          position: fixed;
          bottom: 72px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 110;
          padding: 7px 20px;
          border-radius: 100px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          font-size: 0.82rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
          font-weight: 500;
        }
        .lb-sep { color: rgba(255,255,255,0.3); margin: 0 4px; }

        .lb-dots {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 110;
          display: flex;
          gap: 6px;
          max-width: min(90vw, 480px);
          flex-wrap: nowrap;
          overflow: hidden;
          justify-content: center;
        }
        .lb-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: rgba(255,255,255,0.2);
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
          padding: 0;
        }
        .lb-dot.active {
          background: #c084fc;
          transform: scale(1.5);
        }

        /* ── back button ── */
        .back-btn {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(14, 14, 26, 0.75);
          backdrop-filter: blur(20px);
          color: rgba(255,255,255,0.8);
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .back-btn:hover {
          background: rgba(196,130,251,0.15);
          border-color: rgba(196,130,251,0.4);
          color: #fff;
          box-shadow: 0 8px 40px rgba(196,130,251,0.2);
          transform: translateX(-50%) translateY(-2px);
        }
        .back-arrow { font-size: 1rem; color: #f472b6; }
      `}</style>

      <div className="mem-page">
        {/* blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* hero header */}
        <motion.header
          ref={headerRef}
          className="mem-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mem-icon">📸</span>
          <h1 className="mem-title">Our Best Moments</h1>

          <div className="flex flex-col gap-1">
            <h2>वही पुरानी यादें और शरारतें 🤭</h2>
            <p className="mem-sub">
              कभी बेवजह हँसना, कभी छोटी-छोटी बातों पर नोकझोंक, और फिर खुद ही हँस
              पड़ना… यही तो हमारी दोस्ती की असली पहचान है 😂
            </p>
          </div>
        </motion.header>

        <div className="mem-divider" />

        {/* masonry gallery */}
        <div className="mem-grid">
          {allImages.map((mem, idx) => (
            <GalleryCard
              key={mem.id}
              mem={mem}
              idx={idx}
              onClick={openLightbox}
              onImageLoad={handleImageLoad}
            />
          ))}
        </div>
      </div>

      {/* back button — always visible */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <span className="back-arrow">←</span>
        Back to Start
      </button>

      {/* lightbox */}
      <AnimatePresence>
        {selected && (
          <Lightbox
            key="lb"
            image={selected}
            images={allImages}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
}
