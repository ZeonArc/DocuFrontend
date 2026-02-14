"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ComputerMascot from "./ComputerMascot";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setComplete(true),
      });

      // Disable scrolling during load
      document.body.style.overflow = "hidden";

      // 1. Entrance Animations
      tl.from(mascotRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
      .from(textRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.4")
      .from(progressBarRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2");

      // 2. Progress Bar/Counter Simulation
      const progressObj = { val: 0 };
      tl.to(progressObj, {
        val: 100,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
          if (progressRef.current) {
            progressRef.current.innerText = `${Math.floor(progressObj.val)}%`;
          }
          if (progressBarRef.current) {
             gsap.set(progressBarRef.current, { width: `${progressObj.val}%` });
          }
        },
      });

      // 3. Exit Animation (Slide Up)
      tl.to([textRef.current, progressRef.current, progressBarRef.current?.parentElement], {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(mascotRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)",
      }, "-=0.3")
      .to(containerRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
             document.body.style.overflow = ""; // Re-enable scrolling
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f0f0f0] text-black overflow-hidden"
    >
      {/* Animated Mascot - Smaller */}
      <div ref={mascotRef} className="mb-4 scale-50 md:scale-75 origin-bottom">
        <ComputerMascot />
      </div>

      {/* Animated Text - Bigger */}
      <div ref={textRef} className="flex gap-4 overflow-hidden mb-8 relative z-10">
        <span className="text-6xl md:text-8xl font-black tracking-tighter inline-block">DOCU</span>
        <span className="text-6xl md:text-8xl font-black tracking-tighter inline-block text-gray-500">GITHUB</span>
      </div>
      
      {/* Progress Bar Container - Bigger & Smoother */}
      <div className="w-80 md:w-96 h-4 bg-gray-300 rounded-full overflow-hidden relative shadow-inner">
        <div 
            ref={progressBarRef} 
            className="h-full bg-black w-0 rounded-full"
        />
      </div>

      {/* Percentage Text */}
      <div className="mt-4 overflow-hidden">
         <div ref={progressRef} className="text-lg md:text-xl font-mono font-bold text-gray-500">
            0%
         </div>
      </div>
    </div>
  );
}
