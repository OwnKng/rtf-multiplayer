"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { forwardRef, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import { useState } from "react"

import {
  OrbitControls,
  Stage,
  Decal,
  useTexture,
  useGLTF,
} from "@react-three/drei"
import { Suspense } from "react"
import { Cursor } from "./Cursor"
import { useEmojiTextures } from "@/hooks/useEmojiTextures"

const emojis = [
  {
    label: "kiss",
    unicode: "🥰",
  },
  {
    label: "unicorn",
    unicode: "🦄",
  },
  {
    label: "wave",
    unicode: "🌊",
  },
  {
    label: "mountain",
    unicode: "🏔️",
  },
  {
    label: "rocket",
    unicode: "🚀",
  },
  {
    label: "fire",
    unicode: "🔥",
  },
  {
    label: "rainbow",
    unicode: "🌈",
  },
]

export default function World() {
  const textures = useEmojiTextures(emojis.map((e) => e.unicode))

  const [texture, setTexture] = useState(textures[0])

  return (
    <>
      <div className='absolute top-4 left-4 z-20 rounded-lg shadow-lg divide-x border border-lighterBlack divide-x divide-lighterBlack overflow-hidden rounded-lg bg-lightBlack shadow-lg'>
        {emojis.map(({ unicode, label }, i) => (
          <button
            key={label}
            onClick={() => setTexture(textures[i])}
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
            <Scene decal={texture} />
          </Stage>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}

type DecalProps = {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  renderOrder: number
  map: THREE.Texture
}

function Scene({ decal }: { decal: THREE.Texture }) {
  const { nodes } = useGLTF("/LeePerrySmith.glb") as any

  const cursorRef = useRef<THREE.Line>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const mouseHelper = useRef<THREE.Mesh>(null!)

  const [decals, setDecals] = useState<DecalProps[]>([])

  return (
    <>
      <Suspense fallback={null}>
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          geometry={nodes.LeePerrySmith.geometry}
          dispose={null}
          onClick={({ point }) => {
            if (!point) return
            return setDecals((d) => [
              ...d,
              {
                id: THREE.MathUtils.generateUUID(),
                position: [point.x, point.y, point.z],
                rotation: mouseHelper.current.rotation.toArray(),
                map: decal,
                scale: 0.8,
                renderOrder: d.length,
              },
            ])
          }}
          onPointerMove={({ point, normal }) => {
            if (!point || !normal) return
            const p = point.clone()
            mouseHelper.current.position.copy(p)

            const n = normal.clone()
            n.transformDirection(meshRef.current.matrixWorld)
            n.multiplyScalar(2)
            n.add(point)
            mouseHelper.current.lookAt(n)

            cursorRef.current.geometry.setPoints([p.x, p.y, p.z, n.x, n.y, n.z])
          }}
        >
          <meshStandardMaterial color='black' roughness={0} metalness={0.75} />
          {decals.length > 0 &&
            decals.map(({ id, ...decal }) => <Decal key={id} {...decal} />)}
        </mesh>
      </Suspense>
      <Cursor ref={cursorRef} />
      <mesh ref={mouseHelper} visible={false}>
        <boxGeometry args={[1, 1, 10]} />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}
