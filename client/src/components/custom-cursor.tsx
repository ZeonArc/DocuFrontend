"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type CursorType = "default" | "hover"

const CursorContext = createContext<{
  type: CursorType
  setType: (type: CursorType) => void
}>({ type: "default", setType: () => {} })

export function CursorProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<CursorType>("default")
  return (
    <CursorContext.Provider value={{ type, setType }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  return useContext(CursorContext)
}
