"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  stagger?: number;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 0.8,
    y = 50,
    opacity = 0,
    scale = 1,
    stagger = 0
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = element.children.length > 0 ? element.children : element;
    let hasAnimated = false;

    // Set initial state immediately - no delay
    gsap.set(targets, {
      y,
      opacity,
      scale,
      clearProps: "transform,opacity" // Clear any previous transforms
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          setIsVisible(true);
          
          // Animate in immediately
          if (element.children.length > 0 && stagger > 0) {
            // Stagger animation for children
            gsap.to(element.children, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration,
              delay,
              stagger,
              ease: "power2.out",
              overwrite: true // Prevent conflicting animations
            });
          } else {
            // Single element animation
            gsap.to(element, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration,
              delay,
              ease: "power2.out",
              overwrite: true // Prevent conflicting animations
            });
          }

          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, duration, y, opacity, scale, stagger]);

  return { ref, isVisible };
}

// Predefined animation presets
export const scrollRevealPresets = {
  fadeUp: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  },
  fadeDown: {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  },
  fadeLeft: {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  },
  fadeRight: {
    x: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  },
  scaleUp: {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  },
  staggerCards: {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  }
};