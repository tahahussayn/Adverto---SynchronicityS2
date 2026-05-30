"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypewriterText = ({
  texts,
  className,
  delay = 0,
  speed = 0.07,
  deleteSpeed = 0.03,
  pause = 2000,
}: {
  texts: string[];
  className?: string;
  delay?: number;
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const typeLoop = async () => {
      // Initial delay
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));

      let currentTextIndex = 0;

      while (isMounted) {
        const currentText = texts[currentTextIndex];
        setIsTyping(true);

        // Type forward
        for (let i = 0; i <= currentText.length; i++) {
          if (!isMounted) return;
          setDisplayedText(currentText.slice(0, i));
          await new Promise((resolve) => setTimeout(resolve, speed * 1000));
        }

        setIsTyping(false);
        // Pause at the end of the word
        await new Promise((resolve) => setTimeout(resolve, pause));

        setIsTyping(true);
        // Delete backward
        for (let i = currentText.length; i >= 0; i--) {
          if (!isMounted) return;
          setDisplayedText(currentText.slice(0, i));
          await new Promise((resolve) => setTimeout(resolve, deleteSpeed * 1000));
        }

        // Move to the next text
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        // Pause before typing next word
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    };

    typeLoop();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [texts, delay, speed, deleteSpeed, pause]);

  return (
    <span className={cn("inline", className)}>
      <span>{displayedText}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block w-[4px] h-[1em] ml-1 bg-electric-blue align-middle -mt-[0.2em]",
          isTyping ? "opacity-100" : ""
        )}
      />
    </span>
  );
};
