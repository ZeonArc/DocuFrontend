"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

// Configuration for the expression layer's position and size
// Adjust these values to fine-tune the face placement on the computer screen
const EXPRESSION_CONFIG = {
  top: "32%",
  left: "38%",
  width: "35%",
  height: "30%",
};

const O_MOUTH_CONFIG = {
  centerX: 20,   // Horizontal center position
  centerY: 12,   // Vertical center position
  rx: 6 ,         // Horizontal radius
  ry: 8          // Vertical radius
};

const CHEEKS_CONFIG = {
  top: "50px",     // Vertical position from top of face
  width: "24px",   // Width of each cheek
  height: "12px",  // Height of each cheek
  spread: "4px",   // Padding from sides (affects horizontal spread)
};

function getOMouthPath() {
    const { centerX, centerY, rx, ry } = O_MOUTH_CONFIG;
    // Construct path: Left -> Bottom Arc -> Right -> Top Arc -> Left
    // Control points at (centerX, centerY +/- ry) give a nice "O" shape
    return `M${centerX - rx} ${centerY} Q${centerX} ${centerY + ry} ${centerX + rx} ${centerY} Q${centerX} ${centerY - ry} ${centerX - rx} ${centerY}`;
}



export default function ComputerMascot({ isTyping = false }: { isTyping?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const expressionRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const cheeksRef = useRef<HTMLDivElement>(null);
  
  const isHovering = useRef(false);
  const isTypingRef = useRef(isTyping);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  // Handle input focus/typing state changes
  useEffect(() => {
    if (isHovering.current) return;
    
    if (isTyping && mouthRef.current) {
      // Morph to "O" mouth (Concentrating)
      gsap.to(mouthRef.current, { 
        attr: { d: getOMouthPath() }, 
        duration: 0.3 
      });
    } else if (!isTyping && mouthRef.current) {
        // Return to normal (Split curve)
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
      // If hovering, let the hover interaction control the face
      if (isHovering.current) return;

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

      // Update mouth based on state
      if (mouthRef.current) {
        let targetD = "";
        
        if (isTypingRef.current) {
            // Typing "O" mouth
            targetD = getOMouthPath();
        } else {
            // Normal behavior: Flatten mouth slightly when looking down
            // Normal curve (split): M2 2 Q11 7 20 7 Q29 7 38 2 (Peak Y=7)
            // Flat curve (split):   M2 2 Q11 4 20 4 Q29 4 38 2 (Peak Y=4)
            // Calculate intermediate Y based on moveY
            const baseY = 7;
            const flattenFactor = Math.max(0, moveY / maxDistance); // 0 to 1
            const currentY = baseY - (flattenFactor * 3); // 7 -> 4
            
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
    
    // Reset cheeks immediately (others will be picked up by mousemove)
    if (cheeksRef.current) {
      gsap.to(cheeksRef.current, { opacity: 0, scale: 1, duration: 0.3 });
    }
    // Reset to normal (or typing 'O')
    if (mouthRef.current) {
      const targetD = isTypingRef.current 
        ? getOMouthPath() 
        : "M2 2 Q11 7 20 7 Q29 7 38 2";
      gsap.to(mouthRef.current, { attr: { d: targetD }, duration: 0.2 });
    }
    // Eyes will naturally transition back via mousemove logic, 
    // but we can give them a nudge to reset smoothly
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
        className="absolute flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
        style={{
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
            className="absolute w-full flex justify-between opacity-0 transition-opacity"
            style={{
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
      </div>
    </div>
  );
}
