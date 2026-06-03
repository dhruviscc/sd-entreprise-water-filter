"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleUp" | "fadeIn";
  duration?: number; // duration in milliseconds
  delay?: number;    // delay in milliseconds
  threshold?: number;
}

export default function ScrollReveal({
  children,
  variant = "fadeInUp",
  duration = 800,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If the browser doesn't support IntersectionObserver, render normally
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -60px 0px", // Trigger when element is 60px from entering viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold]);

  const variantClasses = {
    fadeInUp: isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
    fadeInDown: isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10",
    fadeInLeft: isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
    fadeInRight: isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
    scaleUp: isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]",
    fadeIn: isVisible ? "opacity-100" : "opacity-0",
  };

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Premium smooth cubic easeOut
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${variantClasses[variant]}`}
      style={style}
    >
      {children}
    </div>
  );
}
