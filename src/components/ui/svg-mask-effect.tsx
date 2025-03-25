"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SvgMaskEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function SvgMaskEffect({
  children,
  className = "",
}: SvgMaskEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        "--mouse-x": "0px",
        "--mouse-y": "0px",
      } as React.CSSProperties}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <mask id="mask">
            <rect width="100%" height="100%" fill="white" />
            <circle
              r="100"
              cx="var(--mouse-x)"
              cy="var(--mouse-y)"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="white"
          mask="url(#mask)"
          fillOpacity="0.1"
        />
      </svg>
      <div className="relative" style={{ zIndex: 0 }}>
        {children}
      </div>
    </div>
  );
} 