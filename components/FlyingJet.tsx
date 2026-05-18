"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function FlyingJet() {
  const [position, setPosition] = useState({ x: -20, y: 50 });
  const [rotation, setRotation] = useState(90);
  const [speed, setSpeed] = useState(15000);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fly = () => {
      if (isPlayingRef.current) return;
      setSpeed(20000 + Math.random() * 10000);
      setPosition({ x: 120, y: Math.random() * 100 });
      setRotation(90 + Math.random() * 30 - 15);
    };

    const reset = () => {
      if (isPlayingRef.current) return;
      setSpeed(0);
      setPosition({ x: -20, y: Math.random() * 100 });
      setRotation(90);
      timeout = setTimeout(fly, 100);
    };

    reset();
    const interval = setInterval(() => {
      if (!isPlayingRef.current && position.x > 110) {
        reset();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [position.x]);

  const handlePlay = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const startX = position.x;
    const startY = position.y;

    // 1. Dart away fast!
    setSpeed(300);
    const escapeX = Math.random() > 0.5 ? Math.random() * 20 + 80 : Math.random() * 20;
    const escapeY = Math.random() > 0.5 ? Math.random() * 20 + 80 : Math.random() * 20;
    
    setPosition({ x: escapeX, y: escapeY });
    const escapeAngle = Math.atan2(escapeY - startY, escapeX - startX) * (180 / Math.PI);
    setRotation(escapeAngle + 90);

    // 2. Come back to play
    setTimeout(() => {
      setSpeed(800);
      const returnX = startX + (Math.random() * 10 - 5);
      const returnY = startY + (Math.random() * 10 - 5);
      setPosition({ x: returnX, y: returnY });
      const returnAngle = Math.atan2(returnY - escapeY, returnX - escapeX) * (180 / Math.PI);
      setRotation(returnAngle + 90);
      
      // 3. Resume patrol
      setTimeout(() => {
        isPlayingRef.current = false;
        setSpeed(20000);
        setPosition({ x: 120, y: Math.random() * 100 });
        setRotation(90 + Math.random() * 30 - 15);
      }, 1000);

    }, 400);
  };

  return (
    <div
      onMouseEnter={handlePlay}
      className="fixed z-50 cursor-crosshair pointer-events-auto group"
      style={{
        left: `${position.x}vw`,
        top: `${position.y}vh`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transition: `left ${speed}ms linear, top ${speed}ms linear, transform ${speed > 1000 ? 2000 : 300}ms ease-out`,
      }}
    >
      <div className="relative">
        <Image
          src="/sci_fi_jet_transparent.png"
          alt="Sci-Fi Jet"
          width={400}
          height={400}
          className="w-48 h-48 md:w-64 md:h-64 object-contain opacity-90 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]"
          priority
        />
        {/* Glow behind the jet */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-cyan-400/20 blur-2xl pointer-events-none rounded-full"></div>
      </div>
    </div>
  );
}
