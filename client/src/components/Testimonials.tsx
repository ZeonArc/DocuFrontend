"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS_TYPOGRAPHY as CONFIG } from "@/config/sections";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const companies = [
    { name: "MINISTRY OF PUBLIC SECURITY", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "MINISTRY OF FOREIGN AFFAIRS", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "MINISTRY OF CULTURE SPORTS AND TOURISM", size: "text-2xl", font: "font-medium", fontVar: "--font-body" },
    { name: "VINGROUP", size: "text-5xl", font: "font-bold", fontVar: "--font-header" },
    { name: "PETROLIMEX", size: "text-3xl", font: "italic", fontVar: "--font-accent" },
    { name: "VIETINBANK", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "VIETCOMBANK", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "TECHCOMBANK", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "VPBANK", size: "text-5xl", font: "italic", fontVar: "--font-accent" },
    { name: "MB", size: "text-6xl", font: "font-black", fontVar: "--font-header" },
    { name: "TPBANK", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "SHB", size: "text-4xl", font: "font-medium", fontVar: "--font-body" },
    { name: "HDBANK", size: "text-5xl", font: "italic", fontVar: "--font-accent" },
    { name: "PJICO", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "VIETTEL", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "VNG", size: "text-5xl", font: "italic", fontVar: "--font-accent" },
    { name: "VTC", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "FPT", size: "text-6xl", font: "font-black", fontVar: "--font-header" },
    { name: "VINAPHONE", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "SAMSUNG", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "LG", size: "text-5xl", font: "font-bold", fontVar: "--font-header" },
    { name: "VIETNAM AIRLINES", size: "text-2xl", font: "font-medium", fontVar: "--font-body" },
    { name: "BAMBOO AIRWAYS", size: "text-3xl", font: "italic", fontVar: "--font-accent" },
    { name: "OPPO", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "HYUNDAI", size: "text-3xl", font: "font-bold", fontVar: "--font-header" },
    { name: "SABECO", size: "text-5xl", font: "italic", fontVar: "--font-accent" },
    { name: "VINACONEX", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "AND MORE...", size: "text-6xl", font: "font-black underline", fontVar: "--font-header" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".cloud-item");

      // ── Initial setup ──────
      // Words are thrown FROM the viewer's position ONTO the screen.
      // They start BIG (oversized, as if very close to the viewer) and SNAP DOWN
      // to their final size. This is the reverse of a zoom-in — a zoom-out/snap.
      gsap.set(containerRef.current, { overflow: "hidden" });
      gsap.set(headingRef.current, { opacity: 0, scale: 1.8, transformOrigin: "center center" });

      items.forEach((item) => {
        gsap.set(item, {
          // Scatter offsets and scale range are driven from CONFIG.scatter in sections.ts
          scale: gsap.utils.random(CONFIG.scatter.scaleMin, CONFIG.scatter.scaleMax),
          x: gsap.utils.random(-CONFIG.scatter.xRange, CONFIG.scatter.xRange),
          y: gsap.utils.random(-CONFIG.scatter.yRange, CONFIG.scatter.yRange),
          opacity: 0,
          color: CONFIG.heading.color,
          transformOrigin: "center center",
        });
      });

      // ── Main scroll timeline ────
      // Speed is driven by CONFIG.animation.scrub and CONFIG.animation.scrollMultiplier
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${CONFIG.animation.scrollMultiplier}%`,
          scrub: CONFIG.animation.scrub,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Phase 1 — Heading snaps in first (it lands like a stamp, not a float)
      tl.to(
        headingRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.15,
          ease: "back.out(1.4)",   // Slight overshoot — snaps past 1 and bounces back
          transformOrigin: "center center",
        },
        0
      );

      // Phase 2 — Anchor words land first (TECHCOMBANK, CULTURE..., AND MORE...)
      // These are the "attention grabbers" that appear before the flood.
      const anchorIndices = [7, 2, 22]; // TECHCOMBANK, MINISTRY OF CULTURE..., AND MORE...
      const anchors = anchorIndices.map(i => items[i]).filter(Boolean);
      const flood = items.filter((_, i) => !anchorIndices.includes(i));

      tl.to(
        anchors,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: CONFIG.animation.snapDuration,
          ease: "power4.out",  // Sharp, no bounce — slam into place
          stagger: CONFIG.animation.anchorStagger,
        },
        0.12
      );

      // Phase 3 — Rapid chaotic flood of ALL remaining words.
      // They all snap in nearly simultaneously with a slight chaos stagger,
      // then abruptly stop. The chaos resolves instantly into the aligned grid.
      tl.to(
        flood,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: CONFIG.animation.snapDuration,
          ease: "back.out(1.2)",  // Small overshoot — snap feel
          stagger: {
            amount: CONFIG.animation.floodAmount, // Driven from CONFIG.animation.floodAmount
            from: "random",
          },
        },
        0.18
      );

      // Phase 4 — Removed: Heading remains full brightness (#303030) at the end

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="w-full min-h-screen flex flex-col items-center justify-center"
      style={{
        paddingTop: CONFIG.container.paddingTop,
        paddingRight: CONFIG.container.paddingRight,
        paddingBottom: CONFIG.container.paddingBottom,
        paddingLeft: CONFIG.container.paddingLeft,
        backgroundColor: CONFIG.container.backgroundColor,
      }}
    >
      {/* Heading — acts as the section label ("■ Featured Clients" equivalent) */}
      <h2
        ref={headingRef}
        className="responsive-text text-center"
        style={{
          "--fs-mobile": CONFIG.heading.fontSizeMobile,
          "--fs-desktop": CONFIG.heading.fontSizeDesktop,
          fontFamily: CONFIG.heading.fontFamily,
          fontWeight: CONFIG.heading.fontWeight,
          color: CONFIG.heading.color,
          marginBottom: CONFIG.heading.marginBottom,
          transform: `translate(${CONFIG.heading.xOffset}px, ${CONFIG.heading.yOffset}px)`,
        } as React.CSSProperties}
      >
        What people{" "}
        <span
          className="responsive-text"
          style={{
            "--fs-mobile": CONFIG.accent.fontSizeMobile,
            "--fs-desktop": CONFIG.accent.fontSizeDesktop,
            fontFamily: CONFIG.accent.fontFamily,
            fontStyle: CONFIG.accent.fontStyle,
            color: CONFIG.accent.color,
            display: "inline-block",
            transform: `translate(${CONFIG.accent.xOffset}px, ${CONFIG.accent.yOffset}px)`,
          } as React.CSSProperties}
        >
          Say about us ??
        </span>
      </h2>

      {/* Word cloud — words are positioned absolutely by GSAP in scattered state */}
      <div
        className="flex flex-wrap items-center justify-center text-center overflow-hidden"
        style={{
          columnGap: CONFIG.cloudContainer.gapX,
          rowGap: CONFIG.cloudContainer.gapY,
          maxWidth: CONFIG.cloudContainer.maxWidth,
          paddingTop: CONFIG.offset.top,
          paddingRight: CONFIG.offset.right,
          paddingBottom: CONFIG.offset.bottom,
          paddingLeft: CONFIG.offset.left,
        }}
      >
        {companies.map((company, index) => (
          <span
            key={index}
            className={`cloud-item ${company.size} ${company.font} leading-none`}
            style={{ fontFamily: `var(${company.fontVar})` }}
          >
            {company.name}
          </span>
        ))}
      </div>
    </section>
  );
}
