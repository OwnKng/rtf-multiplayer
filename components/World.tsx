"use client"

import { Canvas } from "@react-three/fiber"
import { useState } from "react"
import SocketWrapper from "./SocketWrapper"
import { OrbitControls, Stage } from "@react-three/drei"
import { useEmojiTextures } from "@/hooks/useEmojiTextures"
import Cursors from "./Cursors"
import Scene from "./Scene"
import { emojis } from "@/utils"

function World() {
  const [sticker, setSticker] = useState("🥰")

  return (
    <>
      <div className='absolute top-4 left-4 z-20 rounded-lg shadow-lg divide-x border border-lighterBlack divide-x divide-lighterBlack overflow-hidden rounded-lg bg-lightBlack shadow-lg'>
        {emojis.map(({ unicode, label }, i) => (
          <button
            key={label}
            onClick={() => setSticker(unicode)}
            className={`p-2 text-xl hover:bg-lighterBlack focus:bg-gray-100 cursor-pointer`}
          >
            {unicode}
          </button>
        ))}
      </div>
      <div className='w-full h-screen'>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 50, position: [-2, 5, 10] }}
        >
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

export default function WorldWithSockets() {
  return (
    <SocketWrapper>
      <World />
    </SocketWrapper>
  )
}
