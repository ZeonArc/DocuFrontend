"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
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
      tl.to(".footer-credits", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
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
        <div 
          className="absolute bottom-0 left-0 z-0 origin-bottom-left" 
          style={{ 
            zIndex: 0,
            width: CONFIG.mascotLeft.width,
            height: CONFIG.mascotLeft.height,
            transform: `translate(${CONFIG.mascotLeft.xOffset}px, ${CONFIG.mascotLeft.yOffset}px)`,
          }}
        >
            <video
                src="/videos/footer-d4rkpho3nix.mp4"
                className="w-full h-full object-contain mascot-left cursor-pointer"
                muted
                playsInline
                onMouseEnter={(e) => {
                  const video = e.currentTarget;
                  if (video.paused) {
                    if (video.currentTime === video.duration) {
                      video.currentTime = 0;
                    }
                    video.play();
                  }
                }}
            />

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
            <div className="relative z-10">
                <a 
                  href="https://buymeacoffee.com/d4rkpho3nix" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-105 transition-all"
                  style={{
                    paddingTop: CONFIG.buyMeACoffeeButton.paddingTop,
                    paddingBottom: CONFIG.buyMeACoffeeButton.paddingBottom,
                    paddingLeft: CONFIG.buyMeACoffeeButton.paddingLeft,
                    paddingRight: CONFIG.buyMeACoffeeButton.paddingRight,
                    marginTop: CONFIG.buyMeACoffeeButton.marginTop,
                    marginBottom: CONFIG.buyMeACoffeeButton.marginBottom,
                    transform: `translate(${CONFIG.buyMeACoffeeButton.xOffset}px, ${CONFIG.buyMeACoffeeButton.yOffset}px)`,
                  }}
                >
                  <img 
                    src="/footer-buy-us-a-coffee.png" 
                    alt="Buy me a coffee" 
                    className="object-contain"
                    style={{
                      height: CONFIG.buyMeACoffeeButton.height,
                      width: CONFIG.buyMeACoffeeButton.width,
                    }}
                  />
                </a>
            </div>

            {/* Social Links */}
            <div
              className="flex relative z-20"
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
