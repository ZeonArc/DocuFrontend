"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Command } from "lucide-react";

export default function Header() {
  const logoRef = useRef(null);

  useEffect(() => {
    // Simple rotation animation for the logo
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-6 pointer-events-none">
      <header className="pointer-events-auto bg-white/80 backdrop-blur-md border-2 border-black rounded-full px-8 py-3 flex items-center justify-between w-[90%] max-w-5xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
        
        {/* Animated Logo */}
        <div className="flex items-center gap-2">
          <div ref={logoRef} className="rounded-sm overflow-hidden">
             <img src="/logo.png" alt="DocuGithub Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">DOCUGITHUB</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link href="#hero" className="hover:underline underline-offset-4">Home</Link>
          <Link href="#difference" className="hover:underline underline-offset-4">Why Us?</Link>
          <Link href="#features" className="hover:underline underline-offset-4">Features</Link>
          <Link href="#testimonials" className="hover:underline underline-offset-4">Testimonials</Link>
        </nav>

      </header>
    </div>
  );
}
