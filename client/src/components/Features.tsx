"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const containerRef = useRef(null);

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

      // Animate generic sections with a loop for stagger
      const sections = gsap.utils.toArray(".feature-section");
      sections.forEach((section: any, index) => {
        // Text Content Animation
        const textItems = section.querySelectorAll(".animate-item > *");
        gsap.from(textItems, {
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play reverse play reverse",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Image Animation
        const img = section.querySelector(".feature-image");
        if(img) {
            gsap.from(img, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play reverse play reverse",
                },
                scale: 0.8,
                opacity: 0,
                rotate: index % 2 === 0 ? -5 : 5, // Alternating rotation
                duration: 1.2,
                ease: "back.out(1.5)",
                delay: 0.2
            });
        }
      });
      
      // Stat Counter specific
      // Stat Counter specific
      const statObj = { val: 0 };
      gsap.to(statObj, {
        val: 75,
        scrollTrigger: {
          trigger: ".stat-section",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function() {
          const el = document.querySelector(".stat-percent");
          if(el) el.textContent = Math.ceil(statObj.val) + "%";
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="features" ref={containerRef} className="w-full">
      {/* Section 1: Cat / Stats */}
      <section className="stat-section feature-section w-full min-h-[80vh] flex flex-col md:flex-row border-b-2 border-black">
        <div className="w-full md:w-1/2 p-12 flex items-center justify-center bg-white border-b-2 md:border-b-0 md:border-r-2 border-black">
           <div className="w-full max-w-md aspect-square relative animate-item">
             <img 
                src="https://placehold.co/600x600/white/black?text=Cat+Pushing+Box" 
                alt="Cat Pushing Box"
                className="w-full h-full object-contain filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] feature-image"
             />
           </div>
        </div>
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#f0f0f0]">
          <div className="animate-item">
            <p className="text-[18px] md:text-[21px] font-medium mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>You can save nearly</p>
            <h2 className="text-[40px] md:text-[69px] font-black mb-4 stat-percent" style={{ fontFamily: "var(--font-header)", fontWeight: 700 }}>75%</h2>
            <p className="text-[18px] md:text-[21px] font-medium mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              with our unique intelligent Repository Sensing & One-Click Deployment
            </p>
            <p className="text-[18px] md:text-[21px] text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Dolor et duis nostrud elit ea. Labore et adipiscing ex id Lorem consequat dolor irure reprehenderit irure dolore.
              Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Contextual Code Intelligence (Wizard) */}
      <section className="feature-section w-full min-h-[80vh] flex flex-col md:flex-row border-b-2 border-black">
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#e0e0e0] border-b-2 md:border-b-0 md:border-r-2 border-black order-2 md:order-1">
          <div className="animate-item">
             <h2 className="text-[40px] md:text-[69px] font-black mb-2" style={{ fontFamily: "var(--font-header)", fontWeight: 700 }}>Contextual Code</h2>
             <h3 className="text-[44px] md:text-[76px] italic mb-8" style={{ fontFamily: "var(--font-accent)" }}>Intelligence</h3>
             <p className="text-[18px] md:text-[21px] leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Dolor et duis nostrud elit ea. Labore et adipiscing ex id Lorem consequat dolor irure reprehenderit.
                Labore fugiat adipiscing sunt quis do eu nulla mollit ipsum consequat.
             </p>
             <p className="text-[18px] md:text-[21px] text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Sint eiusmod excepteur mollit fugiat quis laborum voluptate. Excepteur est laborums exercitation proident mollit proident.
             </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-0 flex items-center justify-center bg-white overflow-hidden relative order-1 md:order-2">
            <img 
              src="https://placehold.co/800x800/white/black?text=Wizard+Scene" 
              alt="Wizard in Forest"
              className="w-full h-full object-cover grayscale contrast-125 animate-item feature-image"
            />
        </div>
      </section>

      {/* Section 3: Asset Generation */}
      <section className="feature-section w-full min-h-[80vh] flex flex-col md:flex-row border-b-2 border-black">
         <div className="w-full md:w-1/2 p-12 flex items-center justify-center bg-white border-b-2 md:border-b-0 md:border-r-2 border-black">
           <div className="w-full max-w-md aspect-square relative animate-item">
             <img 
                src="https://placehold.co/600x600/white/black?text=Asset+Generation+Lab" 
                alt="Asset Generation Lab"
                className="w-full h-full object-contain filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] feature-image"
             />
           </div>
        </div>
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#f0f0f0]">
          <div className="animate-item">
             <h2 className="text-[40px] md:text-[69px] font-black mb-2" style={{ fontFamily: "var(--font-header)", fontWeight: 700 }}>Asset Generation</h2>
             <h3 className="text-[44px] md:text-[76px] italic mb-8" style={{ fontFamily: "var(--font-accent)" }}>with Google Flow</h3>
             <p className="text-[18px] md:text-[21px] leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Dolor et duis nostrud elit ea. Labore et adipiscing ex id Lorem consequat dolor irure reprehenderit.
             </p>
             <p className="text-[18px] md:text-[21px] text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Sint eiusmod excepteur mollit fugiat quis laborum voluptate. Excepteur est laborums exercitation proident mollit proident.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
