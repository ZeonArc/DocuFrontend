"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhatMakesUsDifferent() {
  const sectionRef = useRef(null);
  const textRef = useRef<any>(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section Pop-in
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Image Slide & Rotate
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
        x: 100,
        opacity: 0,
        rotate: 5,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2
      });

      // Text Reveal Stagger
      if (textRef.current) {
        gsap.from(textRef.current.children, {
            scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
      }
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="difference" ref={sectionRef} className="w-full min-h-screen flex flex-col md:flex-row border-b-2 border-black overflow-hidden">
      {/* Left Content */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#e0e0e0] border-r-2 border-black">
        <div ref={textRef}>
            <h2 className="text-5xl font-black mb-8">
            What makes us <br />
            <span className="font-serif italic font-normal">Different?</span>
            </h2>

            <div className="space-y-6 text-lg font-medium leading-relaxed opacity-90">
            <p>
                Dolor et duis nostrud elit ea. Labore et adipiscing ex id Lorem consequat dolor irure reprehenderit irure dolore.
                Labore fugiat adipiscing sunt quis do eu nulla mollit ipsum consequat.
            </p>
            <p>
                Sint eiusmod excepteur mollit fugiat quis laborum voluptate. Excepteur est laborums exercitation proident mollit proident.
            </p>
            </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-white relative overflow-hidden">
        <div ref={imageRef} className="w-full max-w-md aspect-square relative">
             <img 
                src="https://placehold.co/600x600/white/black?text=Character+Sketch" 
                alt="Character Sketch"
                className="w-full h-full object-contain filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] mix-blend-multiply"
             />
        </div>
      </div>
    </section>
  );
}
