"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Input } from "./ui/input";
import Image from "next/image";
import ComputerMascot from "./ComputerMascot";
import { HERO_TYPOGRAPHY as HERO_CONFIG } from "@/config/sections";

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
    }, 800);
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
    <section
      id="hero"
      ref={containerRef}
      className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden relative"
      style={{
        backgroundColor: HERO_CONFIG.section.backgroundColor,
        paddingTop: `${HERO_CONFIG.section.paddingTop}px`,
        paddingBottom: `${HERO_CONFIG.section.paddingBottom}px`,
        paddingLeft: `${HERO_CONFIG.section.paddingLeft}px`,
        paddingRight: `${HERO_CONFIG.section.paddingRight}px`,
        fontFamily: HERO_CONFIG.section.fontFamily,
        borderBottom: `${HERO_CONFIG.section.borderBottomWidth}px solid ${HERO_CONFIG.section.borderColor}`
      }}
    >
      <div className="flex flex-col gap-6 max-w-2xl px-4 z-10 w-full md:w-1/2">

        {/* Badge */}
        <div
          className="rounded-full w-fit uppercase"
          style={{
            backgroundColor: HERO_CONFIG.badge.backgroundColor,
            color: HERO_CONFIG.badge.color,
            fontSize: `${HERO_CONFIG.badge.fontSize}px`,
            fontWeight: HERO_CONFIG.badge.fontWeight,
            letterSpacing: HERO_CONFIG.badge.letterSpacing,
            borderColor: HERO_CONFIG.badge.borderColor,
            borderWidth: `${HERO_CONFIG.badge.borderWidth}px`,
            borderStyle: "solid",
            marginBottom: `${HERO_CONFIG.badge.marginBottom}px`,
            padding: "4px 16px",
            transform: `translate(${HERO_CONFIG.badge.xOffset}px, ${HERO_CONFIG.badge.yOffset}px)`,
          }}
        >
          {HERO_CONFIG.badge.text}
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="overflow-hidden whitespace-nowrap"
          style={{
            fontWeight: HERO_CONFIG.title.fontWeight,
            fontFamily: HERO_CONFIG.title.fontFamily,
            lineHeight: HERO_CONFIG.title.lineHeight,
            letterSpacing: HERO_CONFIG.title.letterSpacing,
            color: HERO_CONFIG.title.color,
            textShadow: `${HERO_CONFIG.title.lineWidth}px ${HERO_CONFIG.title.lineWidth}px 0 ${HERO_CONFIG.title.lineColor}`,
            borderLeft: `${HERO_CONFIG.title.leftBorder}px solid ${HERO_CONFIG.title.lineColor}`,
            borderRight: `${HERO_CONFIG.title.rightBorder}px solid ${HERO_CONFIG.title.lineColor}`,
            paddingLeft: HERO_CONFIG.title.leftBorder > 0 ? '8px' : '0',
            paddingRight: HERO_CONFIG.title.rightBorder > 0 ? '8px' : '0',
            transform: `translate(${HERO_CONFIG.title.xOffset}px, ${HERO_CONFIG.title.yOffset}px)`,
          }}
        >
          <div
            style={{
              fontSize: `${HERO_CONFIG.title.fontSizeMobile}px`,
            }}
            className="md:text-[100px]"
          >
             <div className="flex overflow-hidden">
                {HERO_CONFIG.title.text.split("").map((char, i) => (
                  <span key={i} className="hero-char inline-block">{char}</span>
                ))}
             </div>
          </div>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: `${HERO_CONFIG.description.fontSizeMobile}px`,
            color: HERO_CONFIG.description.color,
            fontFamily: HERO_CONFIG.description.fontFamily,
            fontStyle: HERO_CONFIG.description.fontStyle as React.CSSProperties['fontStyle'],
            marginTop: `${HERO_CONFIG.description.marginTop}px`,
            marginBottom: `${HERO_CONFIG.description.marginBottom}px`,
            transform: `translate(${HERO_CONFIG.description.xOffset}px, ${HERO_CONFIG.description.yOffset}px)`,
            width: HERO_CONFIG.description.width,
            height: HERO_CONFIG.description.height,
          }}
          className="md:text-[30px]"
        >
          {HERO_CONFIG.description.text}
        </p>

        {/* Input Container */}
        <div className="relative w-full max-w-lg">
          <div
            className="relative flex items-center"
            style={{
              backgroundColor: HERO_CONFIG.inputBox.containerBackgroundColor,
              borderColor: HERO_CONFIG.inputBox.borderColor,
              borderWidth: `${HERO_CONFIG.inputBox.borderWidth}px`,
              borderStyle: "solid",
              borderRadius: `${HERO_CONFIG.inputBox.borderRadius}px`,
              boxShadow: HERO_CONFIG.inputBox.shadow,
              paddingTop: `${HERO_CONFIG.inputBox.paddingTop}px`,
              paddingBottom: `${HERO_CONFIG.inputBox.paddingBottom}px`,
              paddingLeft: `${HERO_CONFIG.inputBox.paddingLeft}px`,
              paddingRight: `${HERO_CONFIG.inputBox.paddingRight}px`,
            }}
          >
            <Input
              placeholder={HERO_CONFIG.inputBox.placeholderText}
              className="border-none shadow-none focus-visible:ring-0 placeholder-[var(--placeholder-color)]"
              style={{
                backgroundColor: HERO_CONFIG.inputBox.inputFieldBackgroundColor,
                fontFamily: HERO_CONFIG.inputBox.fontFamily,
                fontWeight: HERO_CONFIG.inputBox.fontWeight,
                fontSize: `${HERO_CONFIG.inputBox.fontSize}px`,
                color: HERO_CONFIG.inputBox.textColor,
                "--placeholder-color": HERO_CONFIG.inputBox.placeholderColor,
              } as React.CSSProperties}
              onChange={handleTyping}
              onBlur={() => {
                setIsTyping(false);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              }}
            />
          </div>

          {/* Upload Button */}
          <button
            className="absolute hover:scale-108 transition-transform duration-200"
            style={{
              right: `${HERO_CONFIG.uploadButton.xOffset}px`,
              top: `calc(50% + ${HERO_CONFIG.uploadButton.yOffset}px)`,
              transform: 'translateY(-50%)',
              width: `${HERO_CONFIG.uploadButton.size}px`,
              height: `${HERO_CONFIG.uploadButton.size}px`,
            }}
          >
              <Image
                src="/hero-upload-button.png"
                alt="Upload"
                width={HERO_CONFIG.uploadButton.size}
                height={HERO_CONFIG.uploadButton.size}
                className="w-full h-full object-contain"
              />
          </button>
        </div>
      </div>

      <div ref={mascotRef} className="relative w-full md:w-1/2 flex justify-center mt-12 md:mt-0 pb-12 md:pb-0 z-0">
         <ComputerMascot isTyping={isTyping} />
      </div>
    </section>
  );
}
