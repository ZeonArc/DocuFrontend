"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.from(".mascot-left", { x: -100, y: 100, opacity: 0, duration: 1, ease: "back.out(1.2)" }, "start")
        .from(".mascot-right", { x: 100, y: 100, opacity: 0, duration: 1, ease: "back.out(1.2)" }, "start+=0.2")
        .to(".mascot-bubble", { opacity: 1, y: -10, duration: 0.5, ease: "power2.out" }, "-=0.5")
        .to(".footer-credits", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="w-full py-16 px-4 flex flex-col items-center justify-between bg-white relative overflow-hidden min-h-[400px]">
        
        {/* Mascots positioned absolute at bottom corners */}
        <div className="absolute bottom-0 left-0 w-32 md:w-56 z-0">
            <img 
                src="/mascot1.png" 
                alt="Mascot Left"
                className="w-full h-auto object-contain mascot-left origin-bottom-left"
            />
             {/* Chat Bubble for Boy */}
             <div className="absolute -top-16 left-10 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-xs font-bold hidden md:block opacity-0 mascot-bubble">
                Cool, right?
             </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 md:w-56 z-0">
             <img 
                src="/mascot.png" 
                alt="Mascot Right"
                className="w-full h-auto object-contain mascot-right origin-bottom-right"
            />
        </div>

        {/* Center Content: CTA + Socials */}
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-2xl mt-8">
            {/* CTA Button */}
            <div className="mb-8">
                <Button className="rounded-full px-10 py-8 text-2xl font-black bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] border-2 border-transparent">
                    ☕ Play as a Guest
                </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-20">
                <a href="#" className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <MessageCircle className="w-6 h-6" />
                </a>
            </div>
        </div>
        
        {/* Credits - Animated at bottom */}
         <div className="absolute bottom-4 w-full text-center z-10 footer-credits opacity-0 translate-y-10">
             <p className="text-sm md:text-base font-bold text-gray-800">
                Made with love by <span className="text-red-500 inline-block hover:scale-125 transition-transform duration-300">♥</span> 
             </p>
             <p className="text-lg md:text-xl font-black font-mono mt-1 text-black tracking-tight">
                Dark-Phoenix & Zeon Arcaneus
             </p>
        </div>
    </footer>
  );
}
