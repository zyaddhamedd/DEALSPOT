"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function FlyingJet() {
  const [position, setPosition] = useState({ x: -20, y: 50 });
  const [rotation, setRotation] = useState(45);
  const [speed, setSpeed] = useState(15000);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fly = () => {
      setSpeed(15000 + Math.random() * 5000);
      setPosition({ x: 120, y: Math.random() * 100 });
      setRotation(90 + Math.random() * 20 - 10);
    };

    const reset = () => {
      setSpeed(0);
      setPosition({ x: -20, y: Math.random() * 100 });
      setRotation(90);
      timeout = setTimeout(fly, 50);
    };

    reset();
    const interval = setInterval(reset, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleRunAway = () => {
    // Jet runs away very fast!
    setSpeed(800);
    
    // Choose a random point off-screen
    const newX = Math.random() > 0.5 ? 120 : -20;
    const newY = Math.random() > 0.5 ? 120 : -20;
    
    setPosition({ x: newX, y: newY });
    
    // Rotate to face the escape direction
    const angle = Math.atan2(newY - position.y, newX - position.x) * (180 / Math.PI);
    setRotation(angle);
  };

  return (
    <div
      onMouseEnter={handleRunAway}
      className="fixed z-50 cursor-crosshair pointer-events-auto group"
      style={{
        left: `${position.x}vw`,
        top: `${position.y}vh`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transition: `left ${speed}ms linear, top ${speed}ms linear, transform 400ms ease-in-out`,
      }}
    >
      <div className="relative">
        <Image
          src="/sci_fi_jet.png"
          alt="Sci-Fi Jet"
          width={400}
          height={400}
          className="w-48 h-48 md:w-64 md:h-64 object-contain mix-blend-screen opacity-90 transition-transform duration-300 group-hover:scale-110"
          priority
        />
        {/* Glow behind the jet */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 mix-blend-screen bg-cyan-400/20 blur-2xl pointer-events-none rounded-full"></div>
      </div>
    </div>
  );
}
