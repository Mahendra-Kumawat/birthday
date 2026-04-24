import React from 'react';
import { motion, useAnimation, useInView } from 'motion/react';

export const SplitText = ({ text, className = "", delay = 0, type = "word" }) => {
  const elements = type === "character" ? Array.from(text) : text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: type === "character" ? 0.03 : 0.12, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
      filter: "blur(4px)",
    },
  };

  return (
    <motion.div
      style={{ display: "inline-flex", flexWrap: "wrap", ...((type === "word") && { gap: "0.25em" }) }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {elements.map((el, index) => (
        <motion.span 
          key={index} 
          variants={child} 
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {el}
        </motion.span>
      ))}
    </motion.div>
  );
};
