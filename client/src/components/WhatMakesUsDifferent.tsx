"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY as CONFIG } from "@/config/sections";

gsap.registerPlugin(ScrollTrigger);

export default function WhatMakesUsDifferent() {
  const sectionRef = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Content - Gray Background */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center"
        style={{
          padding: CONFIG.container.paddingAll,
          backgroundColor: CONFIG.container.backgroundColor, // e0e0e0
          // Removed border-r-2
        }}
      >
        <div ref={textRef}>
            <h2
              className="responsive-text font-black"
              style={{
                "--fs-mobile": CONFIG.heading.fontSizeMobile,
                "--fs-desktop": CONFIG.heading.fontSizeDesktop,
                fontFamily: CONFIG.heading.fontFamily,
                fontWeight: CONFIG.heading.fontWeight,
                color: CONFIG.heading.color,
                lineHeight: CONFIG.heading.lineHeight,
                marginBottom: CONFIG.heading.marginBottom,
                transform: `translate(${CONFIG.heading.xOffset}px, ${CONFIG.heading.yOffset}px)`,
              } as React.CSSProperties}
            >
            What makes us <br />
            <span
              className="responsive-text"
              style={{
                "--fs-mobile": CONFIG.accent.fontSizeMobile,
                "--fs-desktop": CONFIG.accent.fontSizeDesktop,
                fontFamily: CONFIG.accent.fontFamily,
                fontWeight: CONFIG.accent.fontWeight,
                color: CONFIG.accent.color,
                fontStyle: CONFIG.accent.fontStyle,
                display: "inline-block",
                transform: `translate(${CONFIG.accent.xOffset}px, ${CONFIG.accent.yOffset}px)`,
              } as React.CSSProperties}
            >Different?</span>
            </h2>

            <div
              className="responsive-text leading-relaxed"
              style={{
                "--fs-mobile": CONFIG.body.fontSizeMobile,
                "--fs-desktop": CONFIG.body.fontSizeDesktop,
                fontFamily: CONFIG.body.fontFamily,
                fontWeight: CONFIG.body.fontWeight,
                color: CONFIG.body.color,
                lineHeight: CONFIG.body.lineHeight,
                opacity: CONFIG.body.opacity,
                display: "flex",
                flexDirection: "column",
                gap: CONFIG.body.gap,
                transform: `translate(${CONFIG.body.xOffset}px, ${CONFIG.body.yOffset}px)`,
                width: CONFIG.body.width,
                height: CONFIG.body.height,
                textAlign: "justify", // Added Text Justification
                // Left and right border implementation
                borderLeft: `${CONFIG.body.borderLeftWidth}px solid ${CONFIG.body.borderColor}`,
                borderRight: `${CONFIG.body.borderRightWidth}px solid ${CONFIG.body.borderColor}`,
                paddingLeft: `${CONFIG.body.paddingLeft}px`,
                paddingRight: `${CONFIG.body.paddingRight}px`,
              } as React.CSSProperties}
            >
            <p>
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
Lorem consequat dolor irure reprehenderit irure dolore.
Labore fugiat adipisicing sunt aute do ex nulla mollit.
Ipsum consequat ex sunt. Voluptate proident irure occaecat
deserunt sit ut excepteur qui occaecat do fugiat. Laboris ut
ut dolor ullamco.
            </p>
            <p>
Sint eiusmod excepteur mollit fugiat quis laborum
voluptate. Nostrud tempor eu laborum exercitation proident
mollit proident dolor. Ipsum ullamco Lorem consequat.
Incididunt officia ipsum amet sunt commodo cupidatat ea
exercitation occaecat veniam. Laborum tempor cupidatat
est qui aute dolore nisi quis est nostrud. Do commodo sit
labore.
            </p>
            </div>
        </div>
      </div>

      {/* Right Image/Video - White Background */}
      <div className="w-full md:w-1/2 relative bg-white overflow-hidden h-[50vh] md:h-auto">
         <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              transform: `translateY(${CONFIG.video.offsetY}px) scale(${CONFIG.video.scale})`,
            }}
            src="/videos/what-makes-us-different.mp4"
         />
      </div>
    </section>
  );
}
