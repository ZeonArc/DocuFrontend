"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    <section id="testimonials" ref={containerRef} className="w-full min-h-[60vh] flex flex-col items-center justify-center p-12 bg-[#e8e8e8] border-b-2 border-black">
      <h2 className="text-[40px] md:text-[69px] font-black mb-12 text-center" style={{ fontFamily: "var(--font-header)", fontWeight: 700 }}>
        What people <span className="text-[44px] md:text-[76px] italic" style={{ fontFamily: "var(--font-accent)" }}>Say about us ??</span>
      </h2>
      
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-6xl text-center opacity-80">
        {companies.map((company, index) => (
            <span key={index} className={`cloud-item ${company.size} ${company.font} leading-none`} style={{ fontFamily: `var(${company.fontVar})` }}>
                {company.name}
            </span>
        ))}
      </div>
    </section>
  );
}
