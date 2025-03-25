"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyScrollReveal({
  children,
  className = "",
}: StickyScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const linearGradients = [
    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
    "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        containerRef.current.style.opacity = "1";
        containerRef.current.style.transform = "translateY(0)";
      } else {
        containerRef.current.style.opacity = "0";
        containerRef.current.style.transform = "translateY(50px)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        opacity: 0,
        transform: "translateY(50px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
} 