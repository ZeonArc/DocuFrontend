"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES_TYPOGRAPHY as CONFIG } from "@/config/sections";

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
                rotate: index % 2 === 0 ? -5 : 5,
                duration: 1.2,
                ease: "back.out(1.5)",
                delay: 0.2
            });
        }
      });

      // Stat Counter
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

  const stats = CONFIG.stats;
  const codeIntel = CONFIG.codeIntelligence;
  const assetGen = CONFIG.assetGeneration;
  const videos = CONFIG.videos;

  return (
    <div id="features" ref={containerRef} className="w-full">
      {/* Section 1: Cat / Stats */}
      <section className="stat-section feature-section w-full min-h-screen flex flex-col md:flex-row">
        {/* Left: Video (Light Grey) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f2f2f2] overflow-hidden">
           <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain feature-image"
              style={{
                transform: `translateY(${videos.stats.offsetY}px) scale(${videos.stats.scale})`,
              }}
              src="/videos/75-percent.mp4"
           />
        </div>
        {/* Right: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center"
          style={{ backgroundColor: stats.container.backgroundColor }}
        >
          <div className="animate-item">
            <p
              className="responsive-text"
              style={{
                "--fs-mobile": stats.prefixText.fontSizeMobile,
                "--fs-desktop": stats.prefixText.fontSizeDesktop,
                fontFamily: stats.prefixText.fontFamily,
                fontWeight: stats.prefixText.fontWeight,
                color: stats.prefixText.color,
                marginBottom: stats.prefixText.marginBottom,
                textAlign: stats.prefixText.textAlign,
                transform: `translate(${stats.prefixText.xOffset}px, ${stats.prefixText.yOffset}px)`,
              } as React.CSSProperties}
            >You can save nearly</p>
            <h2
              className="responsive-text stat-percent"
              style={{
                "--fs-mobile": stats.statNumber.fontSizeMobile,
                "--fs-desktop": stats.statNumber.fontSizeDesktop,
                fontFamily: stats.statNumber.fontFamily,
                fontWeight: stats.statNumber.fontWeight,
                color: stats.statNumber.color,
                marginBottom: stats.statNumber.marginBottom,
                textAlign: stats.statNumber.textAlign,
                transform: `translate(${stats.statNumber.xOffset}px, ${stats.statNumber.yOffset}px)`,
              } as React.CSSProperties}
            >75%</h2>
            <p
              className="responsive-text"
              style={{
                "--fs-mobile": stats.description.fontSizeMobile,
                "--fs-desktop": stats.description.fontSizeDesktop,
                fontFamily: stats.description.fontFamily,
                fontWeight: stats.description.fontWeight,
                color: stats.description.color,
                marginBottom: stats.description.marginBottom,
                textAlign: stats.description.textAlign,
                transform: `translate(${stats.description.xOffset}px, ${stats.description.yOffset}px)`,
              } as React.CSSProperties}
            >
              powered by our unique Intelligent Repository Parsing & One-Click Deployment
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: stats.bodyText.gap,
                transform: `translate(${stats.bodyText.xOffset}px, ${stats.bodyText.yOffset}px)`,
                width: stats.bodyText.width,
                height: stats.bodyText.height,
                // Border/Padding Support
                paddingLeft: `${stats.bodyText.paddingLeft}px`,
                paddingRight: `${stats.bodyText.paddingRight}px`,
              } as React.CSSProperties}
            >
              <p
                className="responsive-text leading-relaxed"
                style={{
                  "--fs-mobile": stats.bodyText.fontSizeMobile,
                  "--fs-desktop": stats.bodyText.fontSizeDesktop,
                  fontFamily: stats.bodyText.fontFamily,
                  fontWeight: stats.bodyText.fontWeight,
                  color: stats.bodyText.color,
                  lineHeight: stats.bodyText.lineHeight,
                  opacity: stats.bodyText.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
                Lorem consequat dolor irure reprehenderit irure dolore.
                Labore fugiat adipisicing sunt aute do ex nulla mollit.
                Ipsum consequat ex sunt. Voluptate proident irure occaecat
                deserunt sit ut excepteur qui occaecat do fugiat. Laboris ut
                ut dolor ullamco.
              </p>
              <p
                className="responsive-text leading-relaxed"
                style={{
                  "--fs-mobile": stats.bodyText.fontSizeMobile,
                  "--fs-desktop": stats.bodyText.fontSizeDesktop,
                  fontFamily: stats.bodyText.fontFamily,
                  fontWeight: stats.bodyText.fontWeight,
                  color: stats.bodyText.color,
                  lineHeight: stats.bodyText.lineHeight,
                  opacity: stats.bodyText.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Sint eiusmod excepteur mollit fugiat quis laborum
                voluptate. Nostrud tempor eu laborum exercitation
                proident mollit proident dolor. Ipsum ullamco Lorem
                consequat. Incididunt officia ipsum amet sunt commodo
                cupidatat ea exercitation occaecat veniam. Laborum
                tempor cupidatat est qui aute dolore nisi quis est nostrud.
                Do commodo sit labore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Contextual Code Intelligence (Wizard) */}
      <section className="feature-section w-full min-h-screen flex flex-col md:flex-row">
        {/* Left: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center order-2 md:order-1"
          style={{ backgroundColor: codeIntel.container.backgroundColor }}
        >
          <div className="animate-item">
             <h2
               className="responsive-text"
               style={{
                 "--fs-mobile": codeIntel.heading.fontSizeMobile,
                 "--fs-desktop": codeIntel.heading.fontSizeDesktop,
                 fontFamily: codeIntel.heading.fontFamily,
                 fontWeight: codeIntel.heading.fontWeight,
                 color: codeIntel.heading.color,
                 marginBottom: codeIntel.heading.marginBottom,
                 transform: `translate(${codeIntel.heading.xOffset}px, ${codeIntel.heading.yOffset}px)`,
               } as React.CSSProperties}
             >Contextual Code</h2>
             <h3
               className="responsive-text"
               style={{
                 "--fs-mobile": codeIntel.accent.fontSizeMobile,
                 "--fs-desktop": codeIntel.accent.fontSizeDesktop,
                 fontFamily: codeIntel.accent.fontFamily,
                 fontStyle: codeIntel.accent.fontStyle,
                 color: codeIntel.accent.color,
                 marginBottom: codeIntel.accent.marginBottom,
                 transform: `translate(${codeIntel.accent.xOffset}px, ${codeIntel.accent.yOffset}px)`,
               } as React.CSSProperties}
             >Intelligence</h3>
             <div
               style={{
                 display: "flex",
                 flexDirection: "column",
                 gap: codeIntel.body.gap,
                 transform: `translate(${codeIntel.body.xOffset}px, ${codeIntel.body.yOffset}px)`,
                 width: codeIntel.body.width,
                 height: codeIntel.body.height,
                 paddingLeft: `${codeIntel.body.paddingLeft}px`,
                 paddingRight: `${codeIntel.body.paddingRight}px`,
               } as React.CSSProperties}
             >
               <p
                 className="responsive-text leading-relaxed"
                 style={{
                   "--fs-mobile": codeIntel.body.fontSizeMobile,
                   "--fs-desktop": codeIntel.body.fontSizeDesktop,
                   fontFamily: codeIntel.body.fontFamily,
                   fontWeight: codeIntel.body.fontWeight,
                   color: codeIntel.body.color,
                   lineHeight: codeIntel.body.lineHeight,
                   opacity: codeIntel.body.opacity,
                   textAlign: "justify",
                 } as React.CSSProperties}
               >
                  Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id Lorem
consequat dolor irure reprehenderit irure dolore. Labore fugiat
adipisicing sunt aute do ex nulla mollit. Ipsum consequat ex
sunt. Voluptate proident irure occaecat deserunt sit ut excepteur
qui occaecat do fugiat. Laboris ut ut dolor ullamco.
               </p>
               <p
                 className="responsive-text leading-relaxed"
                 style={{
                   "--fs-mobile": codeIntel.body.fontSizeMobile,
                   "--fs-desktop": codeIntel.body.fontSizeDesktop,
                   fontFamily: codeIntel.body.fontFamily,
                   fontWeight: codeIntel.body.fontWeight,
                   color: codeIntel.body.color,
                   lineHeight: codeIntel.body.lineHeight,
                   opacity: codeIntel.body.opacity,
                   textAlign: "justify",
                 } as React.CSSProperties}
               >
                  Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
Nostrud tempor eu laborum exercitation proident mollit proident
dolor. Ipsum ullamco Lorem consequat. Incididunt officia ipsum
amet sunt commodo cupidatat ea exercitation occaecat veniam.
Laborum tempor cupidatat est qui aute dolore nisi quis est
                nostrud. Do commodo sit labore.
              </p>
             </div>
          </div>
        </div>
        {/* Right: Video (White) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white overflow-hidden order-1 md:order-2">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain feature-image"
              style={{
                transform: `translateY(${videos.codeIntelligence.offsetY}px) scale(${videos.codeIntelligence.scale})`,
              }}
              src="/videos/contextual-code-intelligence.mp4"
            />
        </div>
      </section>

      {/* Section 3: Asset Generation */}
      <section className="feature-section w-full min-h-screen flex flex-col md:flex-row">
         {/* Left: Video (Light Grey) */}
         <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f2f2f2] overflow-hidden">
           <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain feature-image"
              style={{
                transform: `translateY(${videos.assetGeneration.offsetY}px) scale(${videos.assetGeneration.scale})`,
              }}
              src="/videos/asset-generation-with-google-flow.mp4"
           />
        </div>
        {/* Right: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center"
          style={{ backgroundColor: assetGen.container.backgroundColor }}
        >
          <div className="animate-item">
             <h2
               className="responsive-text"
               style={{
                 "--fs-mobile": assetGen.heading.fontSizeMobile,
                 "--fs-desktop": assetGen.heading.fontSizeDesktop,
                 fontFamily: assetGen.heading.fontFamily,
                 fontWeight: assetGen.heading.fontWeight,
                 color: assetGen.heading.color,
                 marginBottom: assetGen.heading.marginBottom,
                 textAlign: assetGen.heading.textAlign,
                 transform: `translate(${assetGen.heading.xOffset}px, ${assetGen.heading.yOffset}px)`,
               } as React.CSSProperties}
             >Asset Generation</h2>
             <h3
               className="responsive-text"
               style={{
                 "--fs-mobile": assetGen.accent.fontSizeMobile,
                 "--fs-desktop": assetGen.accent.fontSizeDesktop,
                 fontFamily: assetGen.accent.fontFamily,
                 fontStyle: assetGen.accent.fontStyle,
                 color: assetGen.accent.color,
                 marginBottom: assetGen.accent.marginBottom,
                 textAlign: assetGen.accent.textAlign,
                 transform: `translate(${assetGen.accent.xOffset}px, ${assetGen.accent.yOffset}px)`,
               } as React.CSSProperties}
             >with Google Flow</h3>
             <p
               className="responsive-text leading-relaxed"
               style={{
                 "--fs-mobile": assetGen.body.fontSizeMobile,
                 "--fs-desktop": assetGen.body.fontSizeDesktop,
                 fontFamily: assetGen.body.fontFamily,
                 fontWeight: assetGen.body.fontWeight,
                 color: assetGen.body.color,
                 lineHeight: assetGen.body.lineHeight,
                 marginBottom: assetGen.body.marginBottom,
                 transform: `translate(${assetGen.body.xOffset}px, ${assetGen.body.yOffset}px)`,
                 width: assetGen.body.width,
                 height: assetGen.body.height,
                 textAlign: "justify",
                 // Border/Padding Support
                 paddingLeft: `${assetGen.body.paddingLeft}px`,
                 paddingRight: `${assetGen.body.paddingRight}px`,
               } as React.CSSProperties}
             >
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
Lorem cor et duis nostrud elit ea. Labore et adipisicing ex. Id
Lorem consequat dolor irure reprehenderit irure dolore. Dolor
et duis nostrud elit ea. Labore et adipisicing ex. Id Lorem
consequat dolor irure reprehenderit irure dolore. Labore fugiat
adipisicing sunt aute do ex nulla mollit. Ipsum consequat ex
sunt. Voluptate proident irure occaecat deserunt sit ut
excepteur qui occaecat do fugiat. Laboris ut ut dolor ullamco.
             </p>
             <p
               className="responsive-text leading-relaxed"
               style={{
                 "--fs-mobile": assetGen.mutedBody.fontSizeMobile,
                 "--fs-desktop": assetGen.mutedBody.fontSizeDesktop,
                 fontFamily: assetGen.mutedBody.fontFamily,
                 fontWeight: assetGen.mutedBody.fontWeight,
                 color: assetGen.mutedBody.color,
                 lineHeight: assetGen.mutedBody.lineHeight,
                 transform: `translate(${assetGen.mutedBody.xOffset}px, ${assetGen.mutedBody.yOffset}px)`,
                 width: assetGen.mutedBody.width,
                 height: assetGen.mutedBody.height,
                 textAlign: "justify",
                 // Border/Padding Support
                 paddingLeft: `${assetGen.mutedBody.paddingLeft}px`,
                 paddingRight: `${assetGen.mutedBody.paddingRight}px`,
               } as React.CSSProperties}
             >
                
Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
Nostrud tempor eu laborum exercitation proident mollit
proident dolor. Ipsum ullamco Lorem consequat. Incididunt
officia ipsum amet sunt commodo cupidatat ea exercitation
occaecat veniam. Laborum tempor cupidatat est qui aute
dolore nisi quis est nostrud. Do commodo sit labore.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
