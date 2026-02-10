"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef(null);
  
  const companies = [
    { name: "MINISTRY OF PUBLIC SECURITY", size: "text-4xl", font: "font-serif" },
    { name: "MINISTRY OF FOREIGN AFFAIRS", size: "text-3xl", font: "font-mono" },
    { name: "MINISTRY OF CULTURE SPORTS AND TOURISM", size: "text-2xl", font: "font-sans" },
    { name: "VINGROUP", size: "text-5xl border-2 border-black px-2", font: "font-bold" },
    { name: "PETROLIMEX", size: "text-3xl", font: "font-serif italic" },
    { name: "VIETINBANK", size: "text-4xl", font: "font-mono" },
    { name: "VIETCOMBANK", size: "text-3xl", font: "font-sans" },
    { name: "TECHCOMBANK", size: "text-4xl", font: "font-bold" },
    { name: "VPBANK", size: "text-5xl", font: "font-serif" },
    { name: "MB", size: "text-6xl", font: "font-black" },
    { name: "TPBANK", size: "text-3xl", font: "font-mono" },
    { name: "SHB", size: "text-4xl", font: "font-sans" },
    { name: "HDBANK", size: "text-5xl", font: "font-serif" },
    { name: "PJICO", size: "text-3xl", font: "font-mono" },
    { name: "VIETTEL", size: "text-4xl border-b-2 border-black", font: "font-bold" },
    { name: "VNG", size: "text-5xl", font: "font-serif italic" },
    { name: "VTC", size: "text-3xl", font: "font-sans" },
    { name: "FPT", size: "text-6xl", font: "font-black" },
    { name: "VINAPHONE", size: "text-3xl", font: "font-mono" },
    { name: "SAMSUNG", size: "text-4xl", font: "font-serif" },
    { name: "LG", size: "text-5xl", font: "font-bold" },
    { name: "VIETNAM AIRLINES", size: "text-2xl", font: "font-sans" },
    { name: "BAMBOO AIRWAYS", size: "text-3xl", font: "font-serif italic" },
    { name: "OPPO", size: "text-4xl", font: "font-mono" },
    { name: "HYUNDAI", size: "text-3xl", font: "font-bold" },
    { name: "SABECO", size: "text-5xl", font: "font-serif" },
    { name: "VINACONEX", size: "text-3xl", font: "font-sans" },
    { name: "AND MORE...", size: "text-6xl", font: "font-black underline" },
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
      <h2 className="text-5xl font-black mb-12 text-center">
        What people <span className="font-serif italic font-normal">Say about us ??</span>
      </h2>
      
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-6xl text-center opacity-80">
        {companies.map((company, index) => (
            <span key={index} className={`cloud-item ${company.size} ${company.font} leading-none`}>
                {company.name}
            </span>
        ))}
      </div>
    </section>
  );
}
