"use client"
import { usePlayers } from "@/hooks/usePlayers"
import World from "./World"

export default function Cursors() {
  return (
    <div className='w-full h-screen border border-amber-500 relative'>
      <World />
    </div>
  )
}
