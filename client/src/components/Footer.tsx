"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { FOOTER_TYPOGRAPHY as CONFIG } from "@/config/sections";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.from(".mascot-left", { x: -100, y: 100, opacity: 0, duration: 1, ease: "back.out(1.2)" }, "start")
        .from(".mascot-right", { x: 100, y: 100, opacity: 0, duration: 1, ease: "back.out(1.2)" }, "start+=0.2")
        .to(".mascot-bubble", { opacity: 1, y: -10, duration: 0.5, ease: "power2.out" }, "-=0.5")
        .to(".footer-credits", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="meet-the-devs"
      ref={containerRef}
      className="w-full flex flex-col items-center justify-between relative overflow-hidden"
      style={{
        paddingTop: CONFIG.container.paddingY,
        paddingBottom: CONFIG.container.paddingY,
        paddingLeft: CONFIG.container.paddingX,
        paddingRight: CONFIG.container.paddingX,
        backgroundColor: CONFIG.container.backgroundColor,
        minHeight: CONFIG.container.minHeight,
      }}
    >

        {/* Mascots positioned absolute at bottom corners */}
        <div className="absolute bottom-0 left-0 w-32 md:w-56 z-0">
            <img
                src="/mascot1.png"
                alt="Mascot Left"
                className="w-full h-auto object-contain mascot-left origin-bottom-left"
            />
             {/* Chat Bubble for Boy */}
             <div
               className="absolute -top-16 left-10 rounded-xl hidden md:block opacity-0 mascot-bubble"
               style={{
                 fontFamily: CONFIG.chatBubble.fontFamily,
                 fontSize: CONFIG.chatBubble.fontSize,
                 fontWeight: CONFIG.chatBubble.fontWeight,
                 color: CONFIG.chatBubble.color,
                 backgroundColor: CONFIG.chatBubble.backgroundColor,
                 borderColor: CONFIG.chatBubble.borderColor,
                 borderWidth: CONFIG.chatBubble.borderWidth,
                 borderStyle: "solid",
                 borderRadius: CONFIG.chatBubble.borderRadius,
                 padding: CONFIG.chatBubble.padding,
                 boxShadow: CONFIG.chatBubble.shadow,
                 transform: `translate(${CONFIG.chatBubble.xOffset}px, ${CONFIG.chatBubble.yOffset}px)`,
                 width: CONFIG.chatBubble.width,
                 height: CONFIG.chatBubble.height,
               }}
             >
                Cool, right?
             </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 md:w-56 z-0">
             <img
                src="/mascot.png"
                alt="Mascot Right"
                className="w-full h-auto object-contain mascot-right origin-bottom-right"
            />
        </div>

        {/* Center Content: CTA + Socials */}
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-2xl mt-8">
            {/* CTA Button */}
            <div className="mb-8">
                <Button
                  className="rounded-full hover:scale-105 transition-all border-2 border-transparent"
                  style={{
                    fontFamily: CONFIG.ctaButton.fontFamily,
                    fontSize: CONFIG.ctaButton.fontSize,
                    fontWeight: CONFIG.ctaButton.fontWeight,
                    color: CONFIG.ctaButton.color,
                    backgroundColor: CONFIG.ctaButton.backgroundColor,
                    borderRadius: CONFIG.ctaButton.borderRadius,
                    paddingLeft: CONFIG.ctaButton.paddingX,
                    paddingRight: CONFIG.ctaButton.paddingX,
                    paddingTop: CONFIG.ctaButton.paddingY,
                    paddingBottom: CONFIG.ctaButton.paddingY,
                    boxShadow: CONFIG.ctaButton.shadow,
                    transform: `translate(${CONFIG.ctaButton.xOffset}px, ${CONFIG.ctaButton.yOffset}px)`,
                  }}
                >
                    Play as a Guest
                </Button>
            </div>

            {/* Social Links */}
            <div
              className="flex"
              style={{
                gap: CONFIG.socialLinks.gap,
                marginBottom: CONFIG.socialLinks.marginBottom,
              }}
            >
                {[Linkedin, Github, Twitter, MessageCircle].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="hover:bg-black hover:text-white transition-all hover:-translate-y-1"
                    style={{
                      padding: CONFIG.socialLinks.padding,
                      borderColor: CONFIG.socialLinks.borderColor,
                      borderWidth: CONFIG.socialLinks.borderWidth,
                      borderStyle: "solid",
                      borderRadius: CONFIG.socialLinks.borderRadius,
                      boxShadow: CONFIG.socialLinks.shadow,
                    }}
                  >
                    <Icon style={{ width: CONFIG.socialLinks.iconSize, height: CONFIG.socialLinks.iconSize }} />
                  </a>
                ))}
            </div>
        </div>

        {/* Credits - Animated at bottom */}
         <div className="absolute bottom-4 w-full text-center z-10 footer-credits opacity-0 translate-y-10">
             <p
               className="responsive-text"
               style={{
                 "--fs-mobile": CONFIG.creditsSmall.fontSizeMobile,
                 "--fs-desktop": CONFIG.creditsSmall.fontSizeDesktop,
                 fontFamily: CONFIG.creditsSmall.fontFamily,
                 fontWeight: CONFIG.creditsSmall.fontWeight,
                 color: CONFIG.creditsSmall.color,
                 transform: `translate(${CONFIG.creditsSmall.xOffset}px, ${CONFIG.creditsSmall.yOffset}px)`,
               } as React.CSSProperties}
             >
                Made with love by <span className="text-red-500 inline-block hover:scale-125 transition-transform duration-300">&#9829;</span>
             </p>
             <p
               className="responsive-text"
               style={{
                 "--fs-mobile": CONFIG.creditsLarge.fontSizeMobile,
                 "--fs-desktop": CONFIG.creditsLarge.fontSizeDesktop,
                 fontFamily: CONFIG.creditsLarge.fontFamily,
                 fontWeight: CONFIG.creditsLarge.fontWeight,
                 color: CONFIG.creditsLarge.color,
                 letterSpacing: CONFIG.creditsLarge.letterSpacing,
                 marginTop: CONFIG.creditsLarge.marginTop,
                 transform: `translate(${CONFIG.creditsLarge.xOffset}px, ${CONFIG.creditsLarge.yOffset}px)`,
               } as React.CSSProperties}
             >
                Dark-Phoenix & Zeon Arcaneus
             </p>
        </div>
    </footer>
  );
}
