"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";

export function MagneticButton({ children, className, variant = "default", onClick }: { children: React.ReactNode, className?: string, variant?: "default" | "outline", onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={`relative rounded-full px-8 py-6 font-semibold overflow-hidden group ${
        variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-transparent border border-border text-foreground hover:bg-muted"
      } ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
