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

    const flyIdle = () => {
      if (isPlayingRef.current) return;
      
      const targetX = 15 + Math.random() * 70; // Stay within 15% to 85% of screen
      const targetY = 15 + Math.random() * 70;
      
      setSpeed(8000 + Math.random() * 5000); // 8-13 seconds slow glide
      
      setPosition((prev) => {
        const angle = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI);
        // Make sure the plane doesn't snap rotation awkwardly, but this simple math works for now
        setRotation(angle + 90);
        return { x: targetX, y: targetY };
      });

      timeout = setTimeout(flyIdle, 9000); // Next move
    };

    // Initial position center-ish
    setPosition({ x: 50, y: 50 });
    timeout = setTimeout(flyIdle, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handlePlay = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    // 1. Dart away fast and do a barrel roll (spin 360)
    setSpeed(500);
    const jump1X = 15 + Math.random() * 70;
    const jump1Y = 15 + Math.random() * 70;
    
    setPosition((prev) => {
      const angle1 = Math.atan2(jump1Y - prev.y, jump1X - prev.x) * (180 / Math.PI);
      setRotation(angle1 + 90 + 360); // +360 for a joyful spin!
      return { x: jump1X, y: jump1Y };
    });

    // 2. Second quick jump
    setTimeout(() => {
      setSpeed(600);
      const jump2X = 15 + Math.random() * 70;
      const jump2Y = 15 + Math.random() * 70;
      
      setPosition((prev) => {
        const angle2 = Math.atan2(jump2Y - prev.y, jump2X - prev.x) * (180 / Math.PI);
        setRotation(angle2 + 90 - 360); // Spin the other way!
        return { x: jump2X, y: jump2Y };
      });
      
      // 3. Back to idle
      setTimeout(() => {
        isPlayingRef.current = false;
        // Trigger idle immediately
        const targetX = 15 + Math.random() * 70;
        const targetY = 15 + Math.random() * 70;
        setSpeed(10000);
        setPosition((prev) => {
          const angle3 = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI);
          setRotation(angle3 + 90);
          return { x: targetX, y: targetY };
        });
      }, 700);

    }, 600);
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
