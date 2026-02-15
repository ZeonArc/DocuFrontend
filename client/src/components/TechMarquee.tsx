"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Sparkles, Code, Cpu, Cloud, Github } from "lucide-react";

const tools = [
  { name: "Gemma 3", icon: Sparkles },
  { name: "Veo", icon: Cpu },
  { name: "Next.js", icon: Code },
  { name: "Tailwind CSS", icon: Cloud },
  { name: "GSAP", icon: Sparkles },
  { name: "GitHub", icon: Github },
];

export default function TechMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
       const width = marqueeRef.current?.scrollWidth;
       
       gsap.to(marqueeRef.current, {
         xPercent: -50,
         repeat: -1,
         duration: 20,
         ease: "linear",
       });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-black text-white overflow-hidden py-4 border-b-2 border-black z-20 relative">
      <div ref={marqueeRef} className="marquee-inner flex gap-12 whitespace-nowrap w-fit pl-4">
        {/* Render multiple times for seamless loop */}
        {[...tools, ...tools, ...tools, ...tools].map((tool, i) => (
           <div key={i} className="flex items-center gap-3">
              <tool.icon className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-header)" }}>{tool.name}</span>
              <span className="text-gray-500 mx-4">•</span>
           </div>
        ))}
      </div>
    </div>
  )
}
