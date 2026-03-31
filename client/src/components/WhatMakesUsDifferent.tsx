"use client";

import { useRef } from "react";
import { WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY as CONFIG } from "@/config/sections";
import { useWordReveal } from "@/hooks/useWordReveal";
import { useImageSequence } from "@/hooks/useImageSequence";

export default function WhatMakesUsDifferent() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { drawAtProgress } = useImageSequence(canvasRef, {
    basePath: "/frames/what-makes-us-different",
    frameCount: 146,
  });

  useWordReveal(sectionRef, ".wmd-body-text", ".wmd-title-anim", {
    scrollEnd: "+=500%",
    onWordProgress: drawAtProgress,
  });

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
          backgroundColor: CONFIG.container.backgroundColor,
        }}
      >
        <div>
            <div className="wmd-title-anim">
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
            </div>

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
                textAlign: "justify",
                borderLeft: `${CONFIG.body.borderLeftWidth}px solid ${CONFIG.body.borderColor}`,
                borderRight: `${CONFIG.body.borderRightWidth}px solid ${CONFIG.body.borderColor}`,
                paddingLeft: `${CONFIG.body.paddingLeft}px`,
                paddingRight: `${CONFIG.body.paddingRight}px`,
              } as React.CSSProperties}
            >
            <p className="wmd-body-text">
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
Lorem consequat dolor irure reprehenderit irure dolore.
Labore fugiat adipisicing sunt aute do ex nulla mollit.
Ipsum consequat ex sunt. Voluptate proident irure occaecat
deserunt sit ut excepteur qui occaecat do fugiat. Laboris ut
ut dolor ullamco.
            </p>
            <p className="wmd-body-text">
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

      {/* Right: Canvas - White Background */}
      <div className="w-full md:w-1/2 relative bg-white overflow-hidden h-[50vh] md:h-auto">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'contain',
            transform: `translateY(${CONFIG.video.offsetY}px) scale(${CONFIG.video.scale})`,
          }}
        />
      </div>
    </section>
  );
}
