"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(SplitText)
import { useCursor } from "@/components/custom-cursor"

const HEADER_CONFIG = {
  container: {
    topPosition: 20,
    zIndex: 200,
  },
  nav: {
    collapsedWidth: 150,
    expandedWidthMin: 800,
    expandedWidthMax: 1200,
    collapsedHeight: 50,
    expandedHeight: 60,
    backgroundColor: "#d4d4d4",
    backgroundOpacity: 0.85,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 9999,
    transitionDuration: 0.5,
  },
  initText: {
    text: "INIT",
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "normal",
    dotAnimationSpeed: 500,
    xOffset: 0,
    yOffset: 2,
  },
  logo: {
    height: 38,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 4,
    leftOffset: 24,
  },
  brandText: {
    text: "DocuGitHub",
    fontSize: 22,
    fontWeight: 400,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "0.05em",
    leftGap: 12,
  },
  navLinks: {
    fontSize: 16.5,
    fontWeight: 500,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "0.025em",
    gap:20,
    rightOffset: 24,
    hoverUnderlineOffset: 4,
    xOffset: 0,
    yOffset: 1,
  },
  mobileMenu: {
    backgroundColor: "#d4d4d4",
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 16,
    shadow: "4px 4px 0px rgba(0,0,0,1)",
    padding: 32,
    maxWidth: 384,
    menuTitleFontSize: 20,
    menuTitleFontWeight: 700,
    menuTitleFontFamily: "canada-type-gibson",
    menuLinkFontSize: 21,
    menuLinkFontWeight: 500,
    menuLinkFontFamily: "kanit",
    menuLinkGap: 16,
  }
};

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
    }, HEADER_CONFIG.initText.dotAnimationSpeed)
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
      <div
        className="fixed left-1/2 -translate-x-1/2"
        style={{
          top: `${HEADER_CONFIG.container.topPosition}px`,
          zIndex: HEADER_CONFIG.container.zIndex
        }}
      >
        <motion.nav
          className="overflow-hidden backdrop-blur-md"
          style={{
            borderRadius: `${HEADER_CONFIG.nav.borderRadius}px`,
            borderWidth: `${HEADER_CONFIG.nav.borderWidth}px`,
            borderColor: HEADER_CONFIG.nav.borderColor,
            borderStyle: "solid",
            backgroundColor: `${HEADER_CONFIG.nav.backgroundColor}${Math.round(HEADER_CONFIG.nav.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
          }}
          animate={{
            width: scrolled ? `clamp(${HEADER_CONFIG.nav.expandedWidthMin}px, 90vw, ${HEADER_CONFIG.nav.expandedWidthMax}px)` : `${HEADER_CONFIG.nav.collapsedWidth}px`,
            height: scrolled ? `${HEADER_CONFIG.nav.expandedHeight}px` : `${HEADER_CONFIG.nav.collapsedHeight}px`,
          }}
          transition={{ duration: HEADER_CONFIG.nav.transitionDuration, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* INIT text — always mounted, fades out quickly */}
          <motion.div
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.2, delay: scrolled ? 0 : 0.35 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                fontSize: `${HEADER_CONFIG.initText.fontSize}px`,
                fontWeight: HEADER_CONFIG.initText.fontWeight,
                fontFamily: HEADER_CONFIG.initText.fontFamily,
                color: HEADER_CONFIG.initText.color,
                letterSpacing: HEADER_CONFIG.initText.letterSpacing,
                pointerEvents: scrolled ? "none" : "auto",
                left: `calc(50% + ${HEADER_CONFIG.initText.xOffset}px)`,
                top: `calc(50% + ${HEADER_CONFIG.initText.yOffset}px)`
              }}
          >
            {HEADER_CONFIG.initText.text}{dots}
          </motion.div>

          {/* Expanded content — always mounted, fades in after width expands */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.2, delay: scrolled ? 0.3 : 0 }}
            className="flex h-full w-full items-center"
            style={{ pointerEvents: scrolled ? "auto" : "none" }}
          >
            <div
              className="absolute flex h-full items-center cursor-pointer"
              style={{ left: `${HEADER_CONFIG.logo.leftOffset}px`, gap: `${HEADER_CONFIG.brandText.leftGap}px` }}
              onClick={() => { scrollToTop(); showBrandText() }}
              onMouseEnter={() => { setType("hover"); showBrandText() }}
              onMouseLeave={() => setType("default")}
            >
              <div
                className="relative flex-shrink-0 overflow-hidden"
                style={{
                  height: `${HEADER_CONFIG.logo.height}px`,
                  borderRadius: `${HEADER_CONFIG.logo.borderRadius}px`,
                  borderWidth: `${HEADER_CONFIG.logo.borderWidth}px`,
                  borderColor: HEADER_CONFIG.logo.borderColor,
                  borderStyle: "solid"
                }}
              >
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
                  className="block whitespace-nowrap"
                  style={{
                    fontSize: `${HEADER_CONFIG.brandText.fontSize}px`,
                    fontWeight: HEADER_CONFIG.brandText.fontWeight,
                    fontFamily: HEADER_CONFIG.brandText.fontFamily,
                    color: HEADER_CONFIG.brandText.color,
                    letterSpacing: HEADER_CONFIG.brandText.letterSpacing
                  }}
                >
                  {HEADER_CONFIG.brandText.text}
                </span>
              </div>
            </div>

            <div
              className="absolute flex items-center"
              style={{
                right: `${HEADER_CONFIG.navLinks.rightOffset}px`,
                gap: `${HEADER_CONFIG.navLinks.gap}px`,
                transform: `translate(${HEADER_CONFIG.navLinks.xOffset}px, ${HEADER_CONFIG.navLinks.yOffset}px)`
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-colors duration-200 hover:underline"
                  style={{
                    fontSize: `${HEADER_CONFIG.navLinks.fontSize}px`,
                    fontWeight: HEADER_CONFIG.navLinks.fontWeight,
                    fontFamily: HEADER_CONFIG.navLinks.fontFamily,
                    color: HEADER_CONFIG.navLinks.color,
                    letterSpacing: HEADER_CONFIG.navLinks.letterSpacing,
                    textUnderlineOffset: `${HEADER_CONFIG.navLinks.hoverUnderlineOffset}px`
                  }}
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
              className="w-full"
              style={{
                maxWidth: `${HEADER_CONFIG.mobileMenu.maxWidth}px`,
                borderRadius: `${HEADER_CONFIG.mobileMenu.borderRadius}px`,
                borderWidth: `${HEADER_CONFIG.mobileMenu.borderWidth}px`,
                borderColor: HEADER_CONFIG.mobileMenu.borderColor,
                borderStyle: "solid",
                backgroundColor: HEADER_CONFIG.mobileMenu.backgroundColor,
                boxShadow: HEADER_CONFIG.mobileMenu.shadow,
                padding: `${HEADER_CONFIG.mobileMenu.padding}px`
              }}
            >
              <div className="flex justify-between" style={{ marginBottom: `${HEADER_CONFIG.mobileMenu.padding}px` }}>
                <span
                  style={{
                    fontSize: `${HEADER_CONFIG.mobileMenu.menuTitleFontSize}px`,
                    fontWeight: HEADER_CONFIG.mobileMenu.menuTitleFontWeight,
                    fontFamily: HEADER_CONFIG.mobileMenu.menuTitleFontFamily,
                    color: HEADER_CONFIG.navLinks.color
                  }}
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
              <div className="flex flex-col" style={{ gap: `${HEADER_CONFIG.mobileMenu.menuLinkGap}px` }}>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="transition-colors duration-200 hover:underline"
                    style={{
                      fontSize: `${HEADER_CONFIG.mobileMenu.menuLinkFontSize}px`,
                      fontWeight: HEADER_CONFIG.mobileMenu.menuLinkFontWeight,
                      fontFamily: HEADER_CONFIG.mobileMenu.menuLinkFontFamily,
                      color: HEADER_CONFIG.navLinks.color,
                      textUnderlineOffset: `${HEADER_CONFIG.navLinks.hoverUnderlineOffset}px`
                    }}
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
