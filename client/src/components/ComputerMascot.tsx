"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function ComputerMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating animation for the whole computer
    const floatAnim = gsap.to(containerRef.current, {
      y: -15,
      rotation: 2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!leftEyeRef.current || !rightEyeRef.current || !faceRef.current) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const faceRect = faceRef.current.getBoundingClientRect();
      const faceCenterX = faceRect.left + faceRect.width / 2;
      const faceCenterY = faceRect.top + faceRect.height / 2;

      // Calculate angle and distance for eyes
      const angle = Math.atan2(mouseY - faceCenterY, mouseX - faceCenterX);
      const distance = Math.min(10, Math.hypot(mouseX - faceCenterX, mouseY - faceCenterY) / 10);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      // Move eyes
      gsap.to([leftEyeRef.current, rightEyeRef.current], {
        x: moveX,
        y: moveY,
        duration: 0.2,
        overwrite: "auto",
      });
      
      // Subtle face movement for parallax
       gsap.to(faceRef.current, {
        x: moveX * 0.5,
        y: moveY * 0.5,
        duration: 0.4,
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      floatAnim.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      {/* Retro Computer Monitor Casing */}
      <div className="w-[320px] h-[280px] bg-[#e0e0e0] border-4 border-black rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] relative flex flex-col items-center p-4">
        
        {/* Screen Bezel */}
        <div className="w-full h-[200px] bg-[#a0a0a0] border-4 border-black rounded-xl p-2 relative overflow-hidden">
            {/* Screen Glass/Reflection */}
            <div className="absolute top-0 right-0 w-24 h-full bg-white/10 skew-x-12 pointer-events-none z-20"></div>

            {/* The Actual Screen (Face Background) */}
            <div ref={faceRef} className="w-full h-full bg-white border-2 border-black rounded-lg flex items-center justify-center relative shadow-inner">
                
                {/* Left Eye */}
                <div ref={leftEyeRef} className="w-12 h-12 bg-black absolute left-12 top-10 rounded-sm">
                    {/* Tiny reflection in eye */}
                    <div className="w-3 h-3 bg-white absolute top-1 right-1 rounded-full"></div>
                </div>

                {/* Right Eye */}
                <div ref={rightEyeRef} className="w-12 h-12 bg-black absolute right-12 top-10 rounded-sm">
                    <div className="w-3 h-3 bg-white absolute top-1 right-1 rounded-full"></div>
                </div>

                {/* Blush Cheeks */}
                <div className="w-10 h-6 bg-pink-300 rounded-full absolute left-10 top-28 opacity-80"></div>
                <div className="w-10 h-6 bg-pink-300 rounded-full absolute right-10 top-28 opacity-80"></div>

                {/* Month (Smile) */}
                <div className="w-12 h-6 border-b-4 border-black rounded-full absolute top-24"></div>
            </div>
        </div>

        {/* Logo/Badge on Casing */}
        <div className="mt-3 flex items-center justify-between w-full px-4">
            <div className="flex gap-1">
                <div className="w-12 h-2 bg-black/20 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-[10px] font-mono font-bold text-black/50 tracking-widest">DOCU-9000</div>
        </div>
      </div>

      {/* Stand Neck */}
      <div className="absolute bottom-[-20px] w-24 h-12 bg-[#c0c0c0] border-4 border-black z-[-1]"></div>
      
      {/* Stand Base */}
      <div className="absolute bottom-[-30px] w-40 h-8 bg-[#e0e0e0] border-4 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] z-[-2]"></div>
    </div>
  );
}
