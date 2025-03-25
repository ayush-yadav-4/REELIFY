"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface Card {
  id: string;
  content: React.ReactNode;
}

interface InfiniteMovingCardsProps {
  cards: Card[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMovingCards({
  cards,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className = "",
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const speedMap = {
    fast: 20,
    normal: 40,
    slow: 60,
  };

  useEffect(() => {
    const addAnimation = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.scrollWidth;
      const screenWidth = window.innerWidth;

      controls.start({
        x: direction === "left" ? -containerWidth : 0,
        transition: {
          duration: speedMap[speed],
          repeat: Infinity,
          ease: "linear",
        },
      });
    };

    addAnimation();
  }, [controls, direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && controls.stop()}
      onMouseLeave={() => pauseOnHover && controls.start()}
    >
      <motion.div
        className="flex gap-4"
        animate={controls}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0"
          >
            {card.content}
          </div>
        ))}
      </motion.div>
    </div>
  );
} 