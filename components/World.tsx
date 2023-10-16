"use client"

import { Canvas } from "@react-three/fiber"
import { useRef } from "react"

import {
  OrbitControls,
  Stage,
  Decal,
  useTexture,
  useGLTF,
} from "@react-three/drei"
import { Suspense } from "react"

export default function World() {
  const ref = useRef()
  return (
    <div className='w-full h-screen'>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Stage
          controls={ref}
          preset='rembrandt'
          intensity={1}
          environment='city'
        >
          <Scene />
        </Stage>
        <OrbitControls ref={ref} />
      </Canvas>
    </div>
  )
}

function Scene() {
  const pmndrs = useTexture("/pmndrs.png")
  const { nodes } = useGLTF("/bust-lo-draco.glb") as any

  return (
    <Suspense fallback={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0001.geometry}
        position={[0, 0, 0]}
        dispose={null}
      >
        <meshStandardMaterial color='black' roughness={0} metalness={0.5} />
        <Decal position={[0, 2, 1]} scale={1} map={pmndrs} />
      </mesh>
    </Suspense>
  )
}
