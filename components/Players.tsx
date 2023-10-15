import { usePlayers } from "@/hooks/usePlayers"
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline"
import { useThree, extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef } from "react"

extend({ MeshLineGeometry, MeshLineMaterial })

export default function Players() {
  const { others } = usePlayers()
  const { viewport } = useThree()

  return (
    <group>
      {Object.entries(others).map(([id, other]) => {
        if (!other.points) return null

        const points = other.points.map(
          (p) =>
            new THREE.Vector3(p.x * viewport.width, p.y * viewport.height, 0)
        )
        return <Line key={id} points={points} />
      })}
    </group>
  )
}

const Line = ({ points }: { points: THREE.Vector3[] }) => {
  const ref = useRef<THREE.Mesh>(null)
  const linePoints = useRef<THREE.Vector3[]>(points)

  useFrame(() => {
    if (!linePoints.current) return

    ref.current.geometry.setPoints(linePoints.current)
    linePoints.current = linePoints.current.slice(1)
  })

  return (
    <mesh raycast={raycast} ref={ref}>
      <meshLineGeometry />
      <meshLineMaterial lineWidth={0.5} color='hotpink' />
    </mesh>
  )
}
