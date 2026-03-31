"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const LOGOS = [
  { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { name: "React", url: "https://cdn.simpleicons.org/react/000000" },
  { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/000000" },
  { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript/000000" },
  { name: "Docker", url: "https://cdn.simpleicons.org/docker/000000" },
  { name: "Figma", url: "https://cdn.simpleicons.org/figma/000000" },
  { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/000000" },
  { name: "GitHub", url: "https://cdn.simpleicons.org/github/000000" },
  { name: "Google Cloud", url: "https://cdn.simpleicons.org/googlecloud/000000" },
  { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/000000" },
];

export default function TechMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create seamless loop
      // We assume the track has 2 sets of logos. We scroll to -50% and reset.
      timelineRef.current = gsap.timeline({ repeat: -1 });
      
      timelineRef.current.to(trackRef.current, {
        xPercent: -50, 
        ease: "none",
        duration: 30, // Medium speed
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (timelineRef.current) timelineRef.current.pause();
    // Colorize logos
    gsap.to(".marquee-logo", { 
        filter: "grayscale(0%)",
        opacity: 1, 
        duration: 0.3 
    });
  };

  const handleMouseLeave = () => {
    if (timelineRef.current) timelineRef.current.play();
    // Return to grayscale
    gsap.to(".marquee-logo", { 
        filter: "grayscale(100%)", 
        opacity: 0.6,
        duration: 0.3 
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full bg-white overflow-hidden py-8 md:py-12 z-20 relative cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={trackRef} 
        className="flex w-fit items-center whitespace-nowrap will-change-transform"
      >
        {/* Triple duplication to be safe on ultra-wide screens */}
        {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
          <div key={i} className="flex items-center px-8 md:px-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
               src={logo.url}
               alt={logo.name}
               className="marquee-logo h-10 md:h-14 w-auto object-contain transition-all duration-300"
               style={{ 
                   filter: "grayscale(100%)", 
                   opacity: 0.6 
               }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
