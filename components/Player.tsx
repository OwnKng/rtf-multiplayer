import { useFrame, useThree, extend } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline"
import { usePlayers } from "@/hooks/usePlayers"

extend({ MeshLineGeometry, MeshLineMaterial })

export default function Player() {
  const { viewport } = useThree()
  const points = useRef<THREE.Vector3>([])

  const { sendPosition } = usePlayers()

  const tubeRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!tubeRef.current) return

    if (points.current.length < 5) {
      tubeRef.current.geometry.setPoints([])
    }

    tubeRef.current.geometry.setPoints(points.current)
    points.current = points.current.slice(1)
  })

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          if (points.current.length < 30) {
            points.current = [...points.current, e.point]
            sendPosition({
              x: e.point.x / viewport.width,
              y: e.point.y / viewport.height,
            })
          }
        }}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh raycast={raycast} ref={tubeRef}>
        <meshLineGeometry />
        <meshLineMaterial lineWidth={0.5} color='hotpink' />
      </mesh>
    </>
  )
}
