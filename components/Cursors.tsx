"use client"
import { usePlayers } from "@/hooks/usePlayers"
import { useEffect, useRef, useState } from "react"

export default function Cursors() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const { others } = usePlayers()

  useEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      })
    }
  }, [ref])

  return (
    <div className='w-full h-screen border border-amber-500 relative' ref={ref}>
      {Object.values(others).map((cursor, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cursor.x * dimensions.width,
            top: cursor.y * dimensions.height,
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            backgroundColor: "red",
          }}
        />
      ))}
    </div>
  )
}
