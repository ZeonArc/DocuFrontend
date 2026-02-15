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


      // Canvas Image Sequence
      const canvas = document.querySelector("canvas");
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        canvas.width = 960;
        canvas.height = 540; // Aspect ratio of video

        const frameCount = 162; // Total frames extracted
        const currentFrame = { index: 0 };
        const images: HTMLImageElement[] = [];
        
        // Preload images
        for (let i = 1; i <= frameCount; i++) {
          const img = new Image();
          img.src = `/frames/frame_${i.toString().padStart(4, "0")}.jpg`;
          images.push(img);
        }

        const render = () => {
             const img = images[currentFrame.index];
             if (img && img.complete) {
                // Draw image to cover canvas (object-cover behavior)
                // Calculate scaling to cover
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
             }
        };

        // Ensure first frame renders
        images[0].onload = render;

        gsap.to(currentFrame, {
            index: frameCount - 1,
            snap: "index",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0, // Instant scrub
            },
            onUpdate: render,
        });
      }

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
    <section id="how-it-works" ref={sectionRef} className="w-full min-h-screen flex flex-col md:flex-row border-b-2 border-black overflow-hidden">
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

      {/* Right Image/Video - Full Cover */}
      <div className="w-full md:w-1/2 relative bg-black overflow-hidden h-[50vh] md:h-auto">
         <canvas 
            ref={(el) => {
                // @ts-ignore
                window.canvasEl = el; 
            }}
            className="absolute inset-0 w-full h-full object-cover"
         />
      </div>
    </section>
  );
}
