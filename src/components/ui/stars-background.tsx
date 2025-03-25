"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStars = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const numStars = 100;

      stars.current = Array.from({ length: numStars }, (_, i) => ({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: Math.random() * 2 + 1,
      }));
    };

    const animateStars = () => {
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      stars.current = stars.current.map((star) => ({
        ...star,
        y: (star.y + 0.5) % containerHeight,
        x: (star.x + 0.2) % containerWidth,
      }));
    };

    createStars();
    const animationFrame = requestAnimationFrame(function animate() {
      animateStars();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
    >
      {stars.current.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            x: star.x,
            y: star.y,
          }}
        />
      ))}
    </div>
  );
} 