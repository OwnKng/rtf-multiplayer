"use client"
import { Canvas } from "@react-three/fiber"
import { useState } from "react"
import SocketWrapper from "./SocketWrapper"
import { OrbitControls, Stage } from "@react-three/drei"
import Cursors from "./Cursors"
import Scene from "./Scene"
import { emojis } from "@/utils"
import { usePlayers } from "@/hooks/usePlayers"

export default function World() {
  const [sticker, setSticker] = useState("🥰")

  const { others } = usePlayers()

  return (
    <>
      <div className='absolute w-fit flex md:flex-col h-fit flex-col-reverse md:top-4 bottom-4 z-20 left-1/2 transform -translate-x-1/2'>
        <div className='rounded-lg shadow-lg divide-x border border-lightBlack divide-x divide-lightBlack overflow-hidden rounded-lg shadow-lg flex'>
          {emojis.map(({ unicode, label }, i) => (
            <button
              key={label}
              onClick={() => setSticker(unicode)}
              className={`py-2 px-3 text-xl hover:bg-lighterBlack focus:bg-gray-100 cursor-pointer`}
              style={{
                backgroundColor: sticker === unicode ? "#303336" : "#1e1f22",
              }}
            >
              {unicode}
            </button>
          ))}
        </div>
        <div className='pt-2 text-white text-sm text-zinc-400'>
          {Object.entries(others).length ? (
            <span>
              {Object.entries(others).length} other player
              {Object.entries(others).length > 1 ? "s" : ""} here
            </span>
          ) : (
            <p>No one else is here yet</p>
          )}
        </div>
      </div>
      <div className='w-full h-screen'>
        <Canvas shadows dpr={1} camera={{ fov: 50, position: [-2, 5, 10] }}>
          <Stage
            preset='rembrandt'
            intensity={1}
            environment='city'
            adjustCamera={false}
          >
            <Scene sticker={sticker} />
          </Stage>
          <Cursors />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}
