'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
  speed: number;
}

interface ConfettiProps {
  duration?: number;
  pieces?: number;
  trigger: boolean;
}

export default function Confetti({ 
  duration = 3000, 
  pieces = 100, 
  trigger 
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(false);
  
  const colors = [
    '#f94144', // red
    '#f3722c', // orange
    '#f8961e', // yellow-orange
    '#f9c74f', // yellow
    '#90be6d', // green
    '#43aa8b', // teal
    '#577590', // blue
    '#9d4edd', // purple
  ];
  
  useEffect(() => {
    if (trigger && !active) {
      // Create confetti pieces
      const newConfetti: ConfettiPiece[] = [];
      for (let i = 0; i < pieces; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          size: 0.5 + Math.random() * 1,
          speed: 1 + Math.random() * 2
        });
      }
      
      setConfetti(newConfetti);
      setActive(true);
      
      // Set a timeout to clear the confetti
      const timer = setTimeout(() => {
        setActive(false);
        setConfetti([]);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, active, colors, duration, pieces]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-fall"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              width: `${piece.size}rem`,
              height: `${piece.size * 0.4}rem`,
              transform: `rotate(${piece.rotation}deg)`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDuration: `${5 / piece.speed}s`
            }}
          />
        ))}
      </div>
    </div>
  );
} 