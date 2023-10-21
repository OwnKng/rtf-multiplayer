"use client"
import { usePlayers } from "@/hooks/usePlayers"
import { useLayoutEffect, useRef } from "react"
import * as THREE from "three"

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
  const lineRef = useRef<THREE.Line>(null!)

  useLayoutEffect(() => {
    const adjusted = e
      .set(...end)
      .multiplyScalar(2)
      .add(s.set(...start))

    lineRef.current.geometry.setFromPoints([
      new THREE.Vector3(...start),
      adjusted,
    ])
  }, [start, end])

  return (
    <line ref={lineRef}>
      <bufferGeometry attach='geometry' />
      <lineBasicMaterial attach='material' color='grey' />
    </line>
  )
}
