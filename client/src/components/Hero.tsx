"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import ComputerMascot from "./ComputerMascot";

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const mascotRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 800); // Revert to smile after 800ms of inactivity
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-char", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
        delay: 0.2,
      });

      gsap.from(mascotRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-[#f0f0f0] border-b-2 border-black overflow-hidden relative">
      <div className="flex flex-col gap-6 max-w-2xl px-4 z-10 w-full md:w-1/2">
        <div className="border-2 border-black rounded-full px-4 py-1 w-fit bg-white text-xs font-bold uppercase tracking-wider mb-4">
          Beta v1.0
        </div>
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] overflow-hidden">
          <div className="flex overflow-hidden">
            {"DOCU".split("").map((char, i) => (
              <span key={i} className="hero-char inline-block">{char}</span>
            ))}
          </div>
          <div className="flex overflow-hidden">
            {"GITHUB".split("").map((char, i) => (
              <span key={i} className="hero-char inline-block">{char}</span>
            ))}
          </div>
        </h1>
        <p className="text-xl md:text-2xl font-serif italic text-muted-foreground mt-2">
          Your one stop solution to readmes
        </p>

        <div className="relative w-full max-w-md mt-8 group">
          <div className="absolute inset-0 bg-black rounded-lg translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <div className="relative bg-white border-2 border-black rounded-lg flex items-center px-4 py-2">
            <Input 
              placeholder="URL goes here..." 
              className="border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
              onChange={handleTyping}
              onBlur={() => {
                setIsTyping(false);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              }}
            />
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div ref={mascotRef} className="relative w-full md:w-1/2 flex justify-center mt-12 md:mt-0 pb-12 md:pb-0 z-0">
         <ComputerMascot isTyping={isTyping} />
      </div>
    </section>
  );
}
