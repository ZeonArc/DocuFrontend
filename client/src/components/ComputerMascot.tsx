"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HERO_TYPOGRAPHY as HERO_CONFIG } from "@/config/sections";

// Configuration for the expression layer's position and size
// Adjust these values to fine-tune the face placement on the computer screen
const EXPRESSION_CONFIG = {
  top: "32%",
  left: "38%",
  width: "35%",
  height: "30%",
};

const MASCOT_CONFIG = {
  mouthScale: 1.5,
};

const O_MOUTH_CONFIG = {
  centerX: 20,
  centerY: 12,
  rx: 6,
  ry: 8
};

const CHEEKS_CONFIG = {
  top: "50px",
  width: "24px",
  height: "12px",
  spread: "4px",
};

function getOMouthPath(size = 1) {
    const { centerX, centerY, rx, ry } = O_MOUTH_CONFIG;
    const sRx = rx * size;
    const sRy = ry * size;
    return `M${centerX - sRx} ${centerY} Q${centerX} ${centerY + sRy} ${centerX + sRx} ${centerY} Q${centerX} ${centerY - sRy} ${centerX - sRx} ${centerY}`;
}



export default function ComputerMascot({ isTyping = false, isLoading = false }: { isTyping?: boolean; isLoading?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const expressionRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const cheeksRef = useRef<HTMLDivElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isHovering = useRef(false);
  const isTypingRef = useRef(isTyping);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Loading screen animation — swap face for "ANALYZING" + segmented bar
  useEffect(() => {
    const faceEls = [leftEyeRef.current, rightEyeRef.current, mouthRef.current?.closest("svg")].filter(Boolean);
    const segments = segmentRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!isLoading) {
      // Fade face back in, hide overlay
      gsap.to(faceEls, { opacity: 1, duration: 0.3, ease: "power2.out" });
      if (loadingOverlayRef.current) {
        gsap.to(loadingOverlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" });
      }
      segments.forEach(seg => gsap.set(seg, { opacity: 0.15 }));
      return;
    }

    const ctx = gsap.context(() => {
      // Fade face out
      gsap.to(faceEls, { opacity: 0, duration: 0.25, ease: "power2.in" });

      // Show overlay
      if (loadingOverlayRef.current) {
        gsap.fromTo(loadingOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, delay: 0.15, ease: "power2.out" }
        );
      }

      // Stagger-fill segments in a loop
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.3 });
      tl.set(segments, { opacity: 0.15 });
      tl.to(segments, {
        opacity: 1,
        duration: 0.15,
        stagger: 0.2,
        ease: "steps(1)",
      });
      // Brief hold at full, then reset
      tl.to({}, { duration: 0.5 });
      tl.set(segments, { opacity: 0.15 });
    });

    return () => ctx.revert();
  }, [isLoading]);

  useEffect(() => {
    if (isHovering.current) return;

    if (isTyping && mouthRef.current) {
      gsap.to(mouthRef.current, {
        attr: { d: getOMouthPath(MASCOT_CONFIG.mouthScale) },
        duration: 0.3
      });
    } else if (!isTyping && mouthRef.current) {
      gsap.to(mouthRef.current, {
        attr: { d: "M2 2 Q11 7 20 7 Q29 7 38 2" },
        duration: 0.3
      });
    }
  }, [isTyping]);

  useEffect(() => {
    // Floating animation for the whole mascot
    const floatAnim = gsap.to(containerRef.current, {
      y: -15,
      rotation: 2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // If loading or hovering, let those interactions control the face
      if (isLoadingRef.current || isHovering.current) return;

      if (!expressionRef.current || !containerRef.current) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;

      // Calculate angle and distance for expression movement
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      
      // Allow more movement, especially downwards ("look down even more")
      const maxDistance = 15; 
      const distance = Math.min(
        maxDistance,
        Math.hypot(deltaX, deltaY) / 10
      );

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      // Move the whole face container
      gsap.to(expressionRef.current, {
        x: moveX,
        y: moveY,
        duration: 0.2, // Faster response for natural feel
        overwrite: "auto",
      });

      // Individual eye movement and deformation for "natural" feel
      const eyeMoveX = moveX * 0.3;
      const eyeMoveY = moveY * 0.3;
      
      // Squint eyes slightly when looking down (softer effect)
      const eyeScaleY = moveY > 0 ? 1 - (moveY / maxDistance) * 0.15 : 1;

      if (leftEyeRef.current && rightEyeRef.current) {
         gsap.to([leftEyeRef.current, rightEyeRef.current], {
            x: eyeMoveX,
            y: eyeMoveY,
            scaleY: eyeScaleY,
            duration: 0.1,
            overwrite: "auto"
         });
      }

      if (mouthRef.current) {
        let targetD = "";

        if (isTypingRef.current) {
            targetD = getOMouthPath(MASCOT_CONFIG.mouthScale);
        } else {
            const baseY = 7;
            const flattenFactor = Math.max(0, moveY / maxDistance);
            const currentY = baseY - (flattenFactor * 3);

            targetD = `M2 2 Q11 ${currentY} 20 ${currentY} Q29 ${currentY} 38 2`;
        }

        gsap.to(mouthRef.current, {
            attr: { d: targetD },
            duration: 0.1,
            overwrite: "auto"
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      floatAnim.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (isLoadingRef.current) return;
    isHovering.current = true;
    
    // Happy reaction animation
    // 1. Center face
    if (expressionRef.current) {
      gsap.to(expressionRef.current, { x: 0, y: 0, duration: 0.3, ease: "back.out(1.7)" });
    }
    
    // 2. Happy eyes (keep them open but centered)
    if (leftEyeRef.current && rightEyeRef.current) {
      gsap.to([leftEyeRef.current, rightEyeRef.current], { 
        x: 0, 
        y: 0, 
        scaleY: 1, // Keep eyes open
        duration: 0.2 
      });
    }

    // 3. Big Smile / Cat Mouth
    if (mouthRef.current) {
      gsap.to(mouthRef.current, { 
        // Cat mouth "w" shape (2 curves, matches Normal Split count)
        attr: { d: "M2 2 Q11 16 20 6 Q29 16 38 2" }, 
        duration: 0.2 
      });
    }

    // 4. Blushing cheeks
    if (cheeksRef.current) {
      gsap.to(cheeksRef.current, { opacity: 0.8, scale: 1.2, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    isHovering.current = false;

    if (cheeksRef.current) {
      gsap.to(cheeksRef.current, { opacity: 0, scale: 1, duration: 0.3 });
    }

    if (mouthRef.current) {
      const targetD = isTypingRef.current
        ? getOMouthPath(MASCOT_CONFIG.mouthScale)
        : "M2 2 Q11 7 20 7 Q29 7 38 2";
      gsap.to(mouthRef.current, { attr: { d: targetD }, duration: 0.2 });
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      gsap.to([leftEyeRef.current, rightEyeRef.current], { scaleY: 1, duration: 0.2 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
    >
      {/* Body layer (base) */}
      <Image
        src="/hero-body.png"
        alt="DocuGitHub Mascot Body"
        fill
        className="object-contain"
        priority
      />

      {/* Expression layer (Container for eyes/mouth) */}
      <div
        ref={expressionRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute flex flex-col items-center justify-center pointer-events-auto"
        style={{
          cursor: 'var(--cursor-pan)',
          top: EXPRESSION_CONFIG.top,
          left: EXPRESSION_CONFIG.left,
          width: EXPRESSION_CONFIG.width,
          height: EXPRESSION_CONFIG.height,
        }}
      >
        {/* Eyes Row */}
        <div className="flex gap-8 mb-3">
            <div ref={leftEyeRef} className="w-5 h-5 bg-black rounded-sm shadow-sm" />
            <div ref={rightEyeRef} className="w-5 h-5 bg-black rounded-sm shadow-sm" />
        </div>
        
        {/* Mouth (SVG for smooth curve) */}
        <svg width="40" height="24" viewBox="0 0 40 24" className="overflow-visible">
            <path 
                ref={mouthRef}
                d="M2 2 Q11 7 20 7 Q29 7 38 2" 
                fill="none" 
                stroke="black" 
                strokeWidth="4" 
                strokeLinecap="round"
            />


        </svg>

        {/* Cheeks (Optional, adds charm) */}
        <div
            ref={cheeksRef}
            className="absolute w-full flex justify-between"
            style={{
                opacity: 0,
                top: CHEEKS_CONFIG.top,
                paddingLeft: CHEEKS_CONFIG.spread,
                paddingRight: CHEEKS_CONFIG.spread,
            }}
        >
            <div
                style={{ width: CHEEKS_CONFIG.width, height: CHEEKS_CONFIG.height }}
                className="bg-red-400 rounded-full blur-sm"
            />
            <div
                style={{ width: CHEEKS_CONFIG.width, height: CHEEKS_CONFIG.height }}
                className="bg-red-400 rounded-full blur-sm"
            />
        </div>

        {/* Retro "ANALYZING" Loading Screen */}
        <div
          ref={loadingOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0"
          style={{
            transform: `translate(${HERO_CONFIG.loadingAnimation.xOffset}px, ${HERO_CONFIG.loadingAnimation.yOffset}px)`,
          }}
        >
          {/* ANALYZING text */}
          <div

            style={{
              fontFamily: HERO_CONFIG.loadingAnimation.fontFamily,
              fontSize: `${HERO_CONFIG.loadingAnimation.fontSize}px`,
              color: "#000",
              marginBottom: "8px",
            }}
          >
            ANALYZING
          </div>

          {/* Segmented loading bar */}
          <div
            style={{
              display: "flex",
              gap: "3px",
              padding: "3px",
              border: "2.5px solid #000",
              borderRadius: "4px",
              backgroundColor: "#e5e5e5",
            }}
          >
            {Array.from({ length: HERO_CONFIG.loadingAnimation.segmentCount }).map((_, i) => (
              <div
                key={i}
                ref={el => { segmentRefs.current[i] = el; }}
                style={{
                  width: `${HERO_CONFIG.loadingAnimation.segmentWidth}px`,
                  height: `${HERO_CONFIG.loadingAnimation.segmentHeight}px`,
                  backgroundColor: "#000",
                  borderRadius: "1.5px",
                  opacity: 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
