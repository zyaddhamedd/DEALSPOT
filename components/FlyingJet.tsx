"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function FlyingJet() {
  const [position, setPosition] = useState({ x: -20, y: 50 });
  const [rotation, setRotation] = useState(90);
  const [speed, setSpeed] = useState(15000);
  const isPlayingRef = useRef(false);
  const jetRef = useRef<HTMLDivElement>(null);
  const smokeContainerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Real-time smoke particle emitter
  useEffect(() => {
    let animationFrame: number;
    let lastEmit = 0;

    const emitSmoke = (timestamp: number) => {
      if (timestamp - lastEmit > (isPlayingRef.current ? 20 : 45)) { // Faster emit during boost
        if (jetRef.current && smokeContainerRef.current) {
          const rect = jetRef.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const rad = rotationRef.current * (Math.PI / 180);
          const rX = -Math.sin(rad); // Rear direction X
          const rY = Math.cos(rad);  // Rear direction Y
          const rightX = Math.cos(rad); // Right direction X
          const rightY = Math.sin(rad); // Right direction Y

          // Offsets based on the jet's actual size to match the engines
          const engineOffset = rect.height * 0.35; // 35% back from center
          const sideOffset = rect.width * 0.12;    // 12% to the sides

          const spawnParticle = (offsetX: number, offsetY: number) => {
            const smoke = document.createElement("div");
            smoke.className = `smoke-particle${isPlayingRef.current ? ' smoke-fire' : ''}`;
            // Slight random scatter for realism
            const scatterX = (Math.random() - 0.5) * 8;
            const scatterY = (Math.random() - 0.5) * 8;
            smoke.style.left = `${offsetX + scatterX}px`;
            smoke.style.top = `${offsetY + scatterY}px`;
            smokeContainerRef.current?.appendChild(smoke);
            
            setTimeout(() => {
              if (smoke.parentNode) {
                smoke.parentNode.removeChild(smoke);
              }
            }, isPlayingRef.current ? 800 : 1500);
          };

          // Left Engine Smoke
          spawnParticle(
            cx + rX * engineOffset - rightX * sideOffset,
            cy + rY * engineOffset - rightY * sideOffset
          );

          // Right Engine Smoke
          spawnParticle(
            cx + rX * engineOffset + rightX * sideOffset,
            cy + rY * engineOffset + rightY * sideOffset
          );

          lastEmit = timestamp;
        }
      }
      animationFrame = requestAnimationFrame(emitSmoke);
    };

    animationFrame = requestAnimationFrame(emitSmoke);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Idle flight logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const flyIdle = () => {
      if (isPlayingRef.current) return;
      
      const targetX = 15 + Math.random() * 70; // Stay within 15% to 85% of screen
      const targetY = 15 + Math.random() * 70;
      
      setSpeed(8000 + Math.random() * 5000); // 8-13 seconds slow glide
      
      setPosition((prev) => {
        const angle = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI);
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

    // 1. Shoot like a rocket to the bottom of the screen!
    setSpeed(350); // Super fast dart
    
    // Slight angle downwards
    const hitX1 = position.x + (Math.random() * 20 - 10); 
    const hitY1 = 98; // Bottom edge
    
    setPosition((prev) => {
      const angle1 = Math.atan2(hitY1 - prev.y, hitX1 - prev.x) * (180 / Math.PI);
      setRotation(angle1 + 90); 
      return { x: hitX1, y: hitY1 };
    });

    // 2. Bounce off the bottom and fly up
    setTimeout(() => {
      setSpeed(650); // Another fast dart
      const topX = hitX1 > 50 ? 20 + Math.random() * 10 : 70 + Math.random() * 10; // Opposite top side
      const topY = 5 + Math.random() * 5; // Top edge
      
      setPosition((prev) => {
        const angle2 = Math.atan2(topY - prev.y, topX - prev.x) * (180 / Math.PI);
        // Spin while flying up!
        setRotation(angle2 + 90 + (Math.random() > 0.5 ? -360 : 360)); 
        return { x: topX, y: topY };
      });
      
      // 3. Bounce off the top and resume normal flight inside screen
      setTimeout(() => {
        isPlayingRef.current = false;
        setSpeed(12000); // Back to super smooth relaxed flight speed
        const targetX = 50 + (Math.random() * 20 - 10);
        const targetY = 50 + (Math.random() * 20 - 10);
        
        setPosition((prev) => {
          const angle3 = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI);
          setRotation(angle3 + 90);
          return { x: targetX, y: targetY };
        });
      }, 700);

    }, 400); // Small pause at the bottom
  };

  return (
    <>
      <div ref={smokeContainerRef} className="fixed inset-0 pointer-events-none z-40 overflow-hidden" />
      <div
        ref={jetRef}
        onMouseEnter={handlePlay}
        className="fixed z-50 cursor-crosshair pointer-events-auto group"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}vw, ${position.y}vh, 0) translate(-50%, -50%) rotate(${rotation}deg)`,
          transition: `transform ${speed}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
          willChange: 'transform',
        }}
      >
        <div className="relative">
          <Image
            src="/sci_fi_jet_transparent.png"
            alt="Sci-Fi Jet"
            width={400}
            height={400}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain opacity-90 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]"
            priority
          />
          {/* Glow behind the jet */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-cyan-400/20 blur-2xl pointer-events-none rounded-full"></div>
        </div>
      </div>
    </>
  );
}
