"use client"
import { usePlayers } from "@/hooks/usePlayers"
import { extend } from "@react-three/fiber"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"

import * as THREE from "three"

extend({ MeshLineGeometry, MeshLineMaterial })

export default function Cursors() {
  const { others } = usePlayers()

  return (
    <>
      {Object.entries(others).map(([id, { start, end }]) => (
        <Cursor key={id} start={start} end={end} />
      ))}
    </>
  )
}

const s = new THREE.Vector3()
const e = new THREE.Vector3()

function Cursor({
  start,
  end,
  ...props
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  const adjusted = e
    .set(...end)
    .multiplyScalar(2)
    .add(s.set(...start))

  return (
    <mesh {...props} renderOrder={999} castShadow>
      <meshLineGeometry
        points={[...start, adjusted.x, adjusted.y, adjusted.z]}
      />
      <meshLineMaterial lineWidth={0.1} color='#3777FF' />
    </mesh>
  )
}
