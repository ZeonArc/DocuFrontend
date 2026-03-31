"use client"

import { useEffect, useRef, type RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

interface UseWordRevealOptions {
  scrollEnd?: string
  scrub?: boolean | number
  titleWait?: number
  endBuffer?: number
  onWordProgress?: (progress: number) => void
}

export function useWordReveal(
  containerRef: RefObject<HTMLElement | null>,
  textSelector: string,
  titleSelector?: string,
  options: UseWordRevealOptions = {}
) {
  const {
    scrollEnd = "+=500%",
    scrub = true,
    titleWait = 1.5,
    endBuffer = 2,
    onWordProgress,
  } = options

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const splitRef = useRef<SplitText | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const paragraphs = containerRef.current!.querySelectorAll(textSelector)
      if (paragraphs.length === 0) return

      const split = new SplitText(paragraphs, { type: "words" })
      splitRef.current = split

      if (titleSelector) {
        const titleElements = containerRef.current!.querySelectorAll(titleSelector)
        if (titleElements.length > 0) {
          gsap.set(titleElements, { opacity: 0, filter: "blur(20px)", y: 10 })
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollEnd,
          scrub,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onEnter: () => {
            if (titleSelector) {
              const titleEls = containerRef.current!.querySelectorAll(titleSelector)
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  duration: 1,
                  delay: 0.4,
                  ease: "power2.out",
                })
              }
            }
          },
          onEnterBack: () => {
            if (titleSelector) {
              const titleEls = containerRef.current!.querySelectorAll(titleSelector)
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  duration: 1,
                  delay: 0.4,
                  ease: "power2.out",
                })
              }
            }
          },
          onLeaveBack: () => {
            if (titleSelector) {
              const titleEls = containerRef.current!.querySelectorAll(titleSelector)
              if (titleEls.length > 0) {
                gsap.set(titleEls, { opacity: 0, filter: "blur(20px)", y: 10 })
              }
            }
            onWordProgress?.(0)
          },
          onUpdate: (self) => {
            if (onWordProgress) {
              const tlDur = tl.duration()
              if (tlDur === 0) return
              const wordStartFraction = titleWait / tlDur
              const wordEndFraction = (tlDur - endBuffer) / tlDur
              if (self.progress <= wordStartFraction) {
                onWordProgress(0)
              } else if (self.progress >= wordEndFraction) {
                onWordProgress(1)
              } else {
                const wordProgress = (self.progress - wordStartFraction) / (wordEndFraction - wordStartFraction)
                onWordProgress(Math.min(wordProgress, 1))
              }
            }
          },
        },
      })
      tlRef.current = tl

      tl.from(split.words, {
        opacity: 0,
        y: 50,
        ease: "back(4)",
        stagger: { each: 0.15, from: "start" },
      }, titleWait)

      // Exit buffer: section stays pinned with all animations complete
      tl.to({}, { duration: endBuffer })
    }, containerRef)

    return () => {
      if (tlRef.current) tlRef.current.kill()
      if (splitRef.current) splitRef.current.revert()
      ctx.revert()
    }
  }, [containerRef, textSelector, titleSelector, scrollEnd, scrub, titleWait, endBuffer, onWordProgress])
}
