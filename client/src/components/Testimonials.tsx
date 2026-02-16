"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS_TYPOGRAPHY as CONFIG } from "@/config/sections";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef(null);

  const companies = [
    { name: "MINISTRY OF PUBLIC SECURITY", size: "text-4xl", font: "font-bold", fontVar: "--font-header" },
    { name: "MINISTRY OF FOREIGN AFFAIRS", size: "text-3xl", font: "font-medium", fontVar: "--font-body" },
    { name: "MINISTRY OF CULTURE SPORTS AND TOURISM", size: "text-2xl", font: "font-medium", fontVar: "--font-body" },
    { name: "VINGROUP", size: "text-5xl border-2 border-black px-2", font: "font-bold", fontVar: "--font-header" },
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
    { name: "VIETTEL", size: "text-4xl border-b-2 border-black", font: "font-bold", fontVar: "--font-header" },
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
      // Section Pop-in
      gsap.from(containerRef.current, {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play reverse play reverse",
        }
      });

      tl.from("h2", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(".cloud-item", {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: {
            amount: 1,
            from: "random"
        },
        ease: "back.out(1.7)"
      }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="w-full min-h-[60vh] flex flex-col items-center justify-center border-b-2 border-black"
      style={{
        padding: CONFIG.container.paddingAll,
        backgroundColor: CONFIG.container.backgroundColor,
      }}
    >
      <h2
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
        >Say about us ??</span>
      </h2>

      <div
        className="flex flex-wrap items-center justify-center text-center"
        style={{
          columnGap: CONFIG.cloudContainer.gapX,
          rowGap: CONFIG.cloudContainer.gapY,
          opacity: CONFIG.cloudContainer.opacity,
          maxWidth: CONFIG.cloudContainer.maxWidth,
        }}
      >
        {companies.map((company, index) => (
            <span key={index} className={`cloud-item ${company.size} ${company.font} leading-none`} style={{ fontFamily: `var(${company.fontVar})` }}>
                {company.name}
            </span>
        ))}
      </div>
    </section>
  );
}
