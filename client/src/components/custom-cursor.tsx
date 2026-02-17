"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
import { CURSOR_CONFIG } from "@/config/sections"

type CursorType = "default" | "hover" | "scroll-move" | "scroll-vert" | "scroll-horz"

const CursorContext = createContext<{
  type: CursorType
  setType: (type: CursorType) => void
}>({ type: "default", setType: () => {} })

const h = CURSOR_CONFIG.hotspots
const c = (file: string, x: number, y: number, fb: string) =>
  `url("/cursors/${file}") ${x} ${y}, ${fb}`

// Used when programmatically setting cursor during scroll mode
const CURSOR_MAP: Record<CursorType, string> = {
  "default":     c("Pointer.cur",  h.default.x,  h.default.y,  "auto"),
  "hover":       c("Link.cur",     h.pointer.x,  h.pointer.y,  "pointer"),
  "scroll-move": c("Move.cur",     h.move.x,     h.move.y,     "move"),
  "scroll-vert": c("Vert.cur",     h.nsResize.x, h.nsResize.y, "ns-resize"),
  "scroll-horz": c("Horz.cur",     h.ewResize.x, h.ewResize.y, "ew-resize"),
}

// Injects all --cursor-* CSS custom properties with hotspot offsets from CURSOR_CONFIG.
// Called once on mount so globals.css rules (which use var(--cursor-*)) pick up correct hotspots.
function injectCursorVars() {
  const root = document.documentElement
  const set = (prop: string, val: string) => root.style.setProperty(prop, val)
  set("--cursor-size",             `${CURSOR_CONFIG.size}px`)
  set("--cursor-testimonial-size", `${CURSOR_CONFIG.testimonialCursorSize}px`)
  set("--cursor-default",      c("Pointer.cur",      h.default.x,     h.default.y,     "auto"))
  set("--cursor-pointer",      c("Link.cur",          h.pointer.x,     h.pointer.y,     "pointer"))
  set("--cursor-text",         c("Text.cur",          h.text.x,        h.text.y,        "text"))
  set("--cursor-move",         c("Move.cur",          h.move.x,        h.move.y,        "move"))
  set("--cursor-grab",         c("Move.cur",          h.grab.x,        h.grab.y,        "grab"))
  set("--cursor-grabbing",     c("Grabbing.cur",      h.grabbing.x,    h.grabbing.y,    "grabbing"))
  set("--cursor-not-allowed",  c("Unavailable.cur",   h.notAllowed.x,  h.notAllowed.y,  "not-allowed"))
  set("--cursor-help",         c("Help.cur",          h.help.x,        h.help.y,        "help"))
  set("--cursor-crosshair",    c("Cross.cur",         h.crosshair.x,   h.crosshair.y,   "crosshair"))
  set("--cursor-zoom-in",      c("Zoom-in.cur",       h.zoomIn.x,      h.zoomIn.y,      "zoom-in"))
  set("--cursor-zoom-out",     c("Zoom-out.cur",      h.zoomOut.x,     h.zoomOut.y,     "zoom-out"))
  set("--cursor-ew-resize",    c("Horz.cur",          h.ewResize.x,    h.ewResize.y,    "ew-resize"))
  set("--cursor-ns-resize",    c("Vert.cur",          h.nsResize.x,    h.nsResize.y,    "ns-resize"))
  set("--cursor-nwse-resize",  c("Dgn1.cur",          h.nwseResize.x,  h.nwseResize.y,  "nwse-resize"))
  set("--cursor-nesw-resize",  c("Dgn2.cur",          h.neswResize.x,  h.neswResize.y,  "nesw-resize"))
  set("--cursor-wait",         c("Busy.ani",          h.wait.x,        h.wait.y,        "wait"))
  set("--cursor-progress",     c("Work.ani",          h.progress.x,    h.progress.y,    "progress"))
  set("--cursor-context-menu", c("Alternate.cur",     h.contextMenu.x, h.contextMenu.y, "context-menu"))
  set("--cursor-handwriting",  `url("/cursors/Handwriting.png") ${h.handwriting.x} ${h.handwriting.y}, url("/cursors/Handwriting.cur"), pointer`)
  set("--cursor-pan",          c("Pan.cur",           h.pan.x,         h.pan.y,         "all-scroll"))
  set("--cursor-person",       c("Person.cur",        h.person.x,      h.person.y,      "pointer"))
  set("--cursor-pin",          c("Pin.cur",           h.pin.x,         h.pin.y,         "pointer"))
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<CursorType>("default")
  const isScrollMode = useRef(false)
  const scrollOrigin = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })

  // Inject config-driven hotspot offsets into CSS custom properties on first mount
  useEffect(() => { injectCursorVars() }, [])

  useEffect(() => {
    const cursorVar = CURSOR_MAP[type]
    document.body.style.cursor = cursorVar
    document.documentElement.style.cursor = cursorVar
  }, [type])

  useEffect(() => {
    const handleMiddleDown = (e: MouseEvent) => {
      if (e.button !== 1) return
      e.preventDefault()
      isScrollMode.current = true
      scrollOrigin.current = { x: e.clientX, y: e.clientY }
      lastPos.current = { x: e.clientX, y: e.clientY }
      setType("scroll-move")
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isScrollMode.current) return

      // Scroll the page by the delta from the last known position
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      window.scrollBy(dx * CURSOR_CONFIG.scrollSpeed, dy * CURSOR_CONFIG.scrollSpeed)
      lastPos.current = { x: e.clientX, y: e.clientY }

      // Update cursor direction based on displacement from origin
      const absDeltaX = Math.abs(e.clientX - scrollOrigin.current.x)
      const absDeltaY = Math.abs(e.clientY - scrollOrigin.current.y)
      const threshold = 10
      if (absDeltaX < threshold && absDeltaY < threshold) {
        setType("scroll-move")
      } else if (absDeltaY >= absDeltaX) {
        setType("scroll-vert")
      } else {
        setType("scroll-horz")
      }
    }

    const blockAuxClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const exitScrollMode = (e: MouseEvent) => {
      if (!isScrollMode.current) return
      if (e.button === 1 || e.type === "click") {
        isScrollMode.current = false
        setType("default")
      }
    }

    // Capture phase ensures we intercept before the browser's native autoscroll handler
    document.addEventListener("mousedown", handleMiddleDown, true)
    document.addEventListener("auxclick", blockAuxClick, true)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", exitScrollMode)
    document.addEventListener("click", exitScrollMode)

    return () => {
      document.removeEventListener("mousedown", handleMiddleDown, true)
      document.removeEventListener("auxclick", blockAuxClick, true)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", exitScrollMode)
      document.removeEventListener("click", exitScrollMode)
    }
  }, [])

  return (
    <CursorContext.Provider value={{ type, setType }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  return useContext(CursorContext)
}
