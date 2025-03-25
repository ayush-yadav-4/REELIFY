"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WavyBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function WavyBackground({
  children,
  className = "",
}: WavyBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const points = 20;
      const waves = 3;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = [];
      const step = width / points;

      for (let i = 0; i <= points; i++) {
        const x = i * step;
        const y = height / 2;
        const waveHeight = (height / 4) * Math.sin((i / points) * Math.PI * waves);
        d.push(`${i === 0 ? "M" : "L"} ${x} ${y + waveHeight}`);
      }

      path.setAttribute("d", d.join(" "));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(255,255,255,0.1)");
      path.setAttribute("stroke-width", "2");

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.appendChild(path);

      container.appendChild(svg);

      const animate = () => {
        const time = Date.now() / 1000;
        const newD = [];
        for (let i = 0; i <= points; i++) {
          const x = i * step;
          const y = height / 2;
          const waveHeight =
            (height / 4) *
            Math.sin((i / points) * Math.PI * waves + time * 2);
          newD.push(`${i === 0 ? "M" : "L"} ${x} ${y + waveHeight}`);
        }
        path.setAttribute("d", newD.join(" "));
        animationId.current = requestAnimationFrame(animate);
      };

      animate();
    };

    init();

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
} 