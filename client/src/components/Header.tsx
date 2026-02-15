"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(SplitText)
import { useCursor } from "@/components/custom-cursor"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [dotCount, setDotCount] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setType } = useCursor()
  const brandTextRef = useRef<HTMLSpanElement>(null)
  const brandTlRef = useRef<gsap.core.Timeline | null>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showBrandText = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    brandTlRef.current?.play()
    hideTimeoutRef.current = setTimeout(() => {
      brandTlRef.current?.reverse()
    }, 2800)
  }, [])

  useEffect(() => {
    if (!brandTextRef.current) return
    const split = new SplitText(brandTextRef.current, { type: "chars" })
    gsap.set(split.chars, { xPercent: -100, opacity: 0, scale: 0.6 })
    brandTlRef.current = gsap.timeline({ paused: true })
      .to(split.chars, {
        xPercent: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.7)",
      })
    return () => {
      brandTlRef.current?.kill()
      split.revert()
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrolled) return
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [scrolled])

  const dots = ".".repeat(dotCount)

  const navLinks = [
    { name: "UVPs", href: "#features" },
    { name: "How does it work?", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Meet the devs", href: "#meet-the-devs" }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="fixed left-1/2 top-5 z-[200] -translate-x-1/2">
        <motion.nav
          className="overflow-hidden rounded-full border-2 border-black bg-[#d4d4d4]/85 backdrop-blur-md"
          animate={{
            width: scrolled ? 'clamp(800px, 90vw, 1200px)' : '200px',
            height: scrolled ? '60px' : '50px',
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* INIT text — always mounted, fades out quickly */}
          <motion.div
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.2, delay: scrolled ? 0 : 0.35 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-black"
            style={{ fontFamily: "var(--font-header)", pointerEvents: scrolled ? "none" : "auto" }}
          >
            INIT{dots}
          </motion.div>

          {/* Expanded content — always mounted, fades in after width expands */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.2, delay: scrolled ? 0.3 : 0 }}
            className="flex h-full w-full items-center"
            style={{ pointerEvents: scrolled ? "auto" : "none" }}
          >
            <div
              className="absolute left-6 flex h-full items-center cursor-pointer gap-3"
              onClick={() => { scrollToTop(); showBrandText() }}
              onMouseEnter={() => { setType("hover"); showBrandText() }}
              onMouseLeave={() => setType("default")}
            >
              <div className="relative flex-shrink-0 overflow-hidden rounded border-2 border-black" style={{ height: "38px" }}>
                <video
                  src="/logo.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <span
                  ref={brandTextRef}
                  className="block whitespace-nowrap text-sm font-bold text-black"
                  style={{ fontFamily: "var(--font-header)" }}
                >
                  DOCUGITHUB
                </span>
              </div>
            </div>

            <div className="absolute right-6 flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-black transition-colors duration-200 hover:underline underline-offset-4"
                  style={{ fontFamily: "var(--font-body)" }}
                  onMouseEnter={() => setType("hover")}
                  onMouseLeave={() => setType("default")}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector(link.href)
                    if (element) {
                      if (mobileMenuOpen) setMobileMenuOpen(false)
                      const yOffset = -80
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                      window.scrollTo({ top: y, behavior: 'smooth' })
                    }
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.nav>

        <motion.button
          className="absolute right-4 top-[25px] -translate-y-1/2 text-black md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setMobileMenuOpen(true)}
          onMouseEnter={() => setType("hover")}
          onMouseLeave={() => setType("default")}
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-2xl border-2 border-black bg-[#d4d4d4] p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              <div className="mb-8 flex justify-between">
                <span
                  className="text-xl font-bold text-black"
                  style={{ fontFamily: "var(--font-header)" }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-black"
                  onMouseEnter={() => setType("hover")}
                  onMouseLeave={() => setType("default")}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-black transition-colors duration-200 hover:underline underline-offset-4"
                    style={{ fontFamily: "var(--font-body)" }}
                    onMouseEnter={() => setType("hover")}
                    onMouseLeave={() => setType("default")}
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector(link.href)
                      if (element) {
                        setMobileMenuOpen(false)
                        const yOffset = -80
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                        window.scrollTo({ top: y, behavior: 'smooth' })
                      }
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
