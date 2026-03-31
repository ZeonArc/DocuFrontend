"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface UseImageSequenceOptions {
  basePath: string
  frameCount: number
  preload?: boolean
}

export function useImageSequence(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseImageSequenceOptions
) {
  const { basePath, frameCount, preload = true } = options
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const [ready, setReady] = useState(false)
  const currentFrameRef = useRef(-1)

  useEffect(() => {
    if (!preload) return

    const images: HTMLImageElement[] = new Array(frameCount)
    let loaded = 0

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `${basePath}/${String(i + 1).padStart(4, "0")}.webp`
      img.onload = () => {
        loaded++
        loadedRef.current = loaded
        if (i === 0 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")
          if (ctx) {
            canvasRef.current.width = img.naturalWidth
            canvasRef.current.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            currentFrameRef.current = 0
          }
        }
        if (loaded === frameCount) {
          setReady(true)
        }
      }
      images[i] = img
    }

    imagesRef.current = images

    return () => {
      images.forEach(img => { img.src = "" })
      imagesRef.current = []
      loadedRef.current = 0
      currentFrameRef.current = -1
    }
  }, [basePath, frameCount, preload, canvasRef])

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const idx = Math.max(0, Math.min(frameIndex, imagesRef.current.length - 1))
    if (idx === currentFrameRef.current) return

    const img = imagesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }

    ctx.drawImage(img, 0, 0)
    currentFrameRef.current = idx
  }, [canvasRef])

  const drawAtProgress = useCallback((progress: number) => {
    const frameIndex = Math.round(progress * (frameCount - 1))
    drawFrame(frameIndex)
  }, [drawFrame, frameCount])

  return { ready, drawFrame, drawAtProgress, loadedCount: loadedRef.current }
}
