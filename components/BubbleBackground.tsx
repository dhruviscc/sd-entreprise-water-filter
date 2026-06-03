"use client";

import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  wobbleAmount: number;
  side: 'left' | 'right';
}

interface BubbleBackgroundProps {
  zIndex?: number;
}

export default function BubbleBackground({ zIndex = -1 }: BubbleBackgroundProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const count = 5;
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 12 + 6,
          left: Math.random() * 100,
          delay: Math.random() * 12,
          duration: Math.random() * 20 + 20,
          opacity: Math.random() * 0.4 + 0.4,
          wobbleAmount: Math.random() * 60 + 20,
          side: i % 2 === 0 ? 'left' : 'right',
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble-particle"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.side === 'left' ? '-5%' : 'auto',
            right: bubble.side === 'right' ? '-5%' : 'auto',
            top: `${bubble.left}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            opacity: bubble.opacity,
            animationName: bubble.side === 'left' ? 'bubble-flow-left' : 'bubble-flow-right',
            ["--wobble" as string]: `${bubble.wobbleAmount}px`,
          }}
        />
      ))}

      {/* A few large, very faint bubbles for depth */}
      {[1, 2, 3, 4].map((i) => {
        const side = i % 2 === 0 ? 'left' : 'right';
        return (
          <div
            key={`big-${i}`}
            className="bubble-particle bubble-large"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: side === 'left' ? '-10%' : 'auto',
              right: side === 'right' ? '-10%' : 'auto',
              top: `${(i * 25) % 100}%`,
              animationDelay: `${i * 3.5}s`,
              animationDuration: `${60 + i * 15}s`,
              opacity: 0.1,
              animationName: side === 'left' ? 'bubble-flow-left' : 'bubble-flow-right',
              ["--wobble" as string]: `${30 + i * 10}px`,
            }}
          />
        );
      })}

      <style>{`
        .bubble-particle {
          position: absolute;
          background: radial-gradient(circle at 30% 30%, white, rgba(46, 156, 190, 0.4));
          border-radius: 50%;
          filter: blur(1px);
          pointer-events: none;
        }
        @keyframes bubble-flow-left {
          0% {
            transform: translateX(0) translateY(0) scale(0.8);
          }
          100% {
            transform: translateX(110vw) translateY(-200px) scale(1.2);
          }
        }
        @keyframes bubble-flow-right {
          0% {
            transform: translateX(0) translateY(0) scale(0.8);
          }
          100% {
            transform: translateX(-110vw) translateY(-200px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
