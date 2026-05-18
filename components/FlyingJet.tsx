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
      if (timestamp - lastEmit > 35) { // Emit every 35ms for dense smoke
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
            smoke.className = "smoke-particle";
            // Slight random scatter for realism
            const scatterX = (Math.random() - 0.5) * 10;
            const scatterY = (Math.random() - 0.5) * 10;
            smoke.style.left = `${offsetX + scatterX}px`;
            smoke.style.top = `${offsetY + scatterY}px`;
            smokeContainerRef.current?.appendChild(smoke);
            
            setTimeout(() => {
              if (smoke.parentNode) {
                smoke.parentNode.removeChild(smoke);
              }
            }, 1800);
          };

          // Center Engine Smoke (for denser effect)
          spawnParticle(
            cx + rX * engineOffset,
            cy + rY * engineOffset
          );

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

    // 1. Dart to a bottom corner based on current position
    setSpeed(600); // Fast dart
    const isLeft = position.x < 50;
    
    // If on the left, fly to the right corner, and vice versa
    const cornerX = isLeft ? 90 + Math.random() * 5 : 5 + Math.random() * 5;
    const cornerY = 85 + Math.random() * 10; // Bottom corners
    
    setPosition((prev) => {
      const angle1 = Math.atan2(cornerY - prev.y, cornerX - prev.x) * (180 / Math.PI);
      setRotation(angle1 + 90); 
      return { x: cornerX, y: cornerY };
    });

    // 2. Bounce off the corner and fly to the top edge
    setTimeout(() => {
      setSpeed(600); // Another fast dart
      const topX = isLeft ? 15 + Math.random() * 10 : 75 + Math.random() * 10; // Opposite top side
      const topY = 5 + Math.random() * 5; // Top edge
      
      setPosition((prev) => {
        const angle2 = Math.atan2(topY - prev.y, topX - prev.x) * (180 / Math.PI);
        // Spin while flying to the top!
        setRotation(angle2 + 90 + (isLeft ? -360 : 360)); 
        return { x: topX, y: topY };
      });
      
      // 3. Bounce off the top and resume normal flight inside screen
      setTimeout(() => {
        isPlayingRef.current = false;
        setSpeed(10000); // Back to relaxed flight speed
        const targetX = 50 + (Math.random() * 20 - 10);
        const targetY = 50 + (Math.random() * 20 - 10);
        
        setPosition((prev) => {
          const angle3 = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI);
          setRotation(angle3 + 90);
          return { x: targetX, y: targetY };
        });
      }, 650);

    }, 600);
  };

  return (
    <>
      <div ref={smokeContainerRef} className="fixed inset-0 pointer-events-none z-40 overflow-hidden" />
      <div
        ref={jetRef}
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
    </>
  );
}
