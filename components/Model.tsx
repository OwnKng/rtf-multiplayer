//@ts-nocheck
import { ForwardedRef, forwardRef, useLayoutEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { usePlayers } from "@/hooks/usePlayers"
import { Suspense, useRef } from "react"
import * as THREE from "three"

export const Model = forwardRef(function Model(
  props: { sticker: string },
  ref: ForwardedRef<THREE.Mesh>
) {
  const { nodes } = useGLTF("/LeePerrySmith.glb") as any

  const mouseHelper = useRef<THREE.Mesh>(null!)
  const lineRef = useRef<THREE.Line>(null!)

  const { sendPosition, sendSticker } = usePlayers()

  useLayoutEffect(() => {
    lineRef.current.geometry.setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <mesh
          ref={ref}
          {...props}
          castShadow
          receiveShadow
          geometry={nodes.LeePerrySmith.geometry}
          dispose={null}
          onClick={({ point }) => {
            if (!point) return

            sendSticker(
              [point.x, point.y, point.z],
              [
                mouseHelper.current.rotation.x,
                mouseHelper.current.rotation.y,
                mouseHelper.current.rotation.z,
              ],
              props.sticker
            )
          }}
          onPointerMove={({ point, normal }) => {
            if (!point || !normal) return
            const p = point.clone()

            mouseHelper.current.position.copy(p)

            const n = normal.clone()
            n.transformDirection(ref.current.matrixWorld)
            const end = n.clone()
            n.multiplyScalar(2)
            n.add(point)

            mouseHelper.current.lookAt(n)

            const positions = lineRef.current.geometry.attributes.position
            positions.setXYZ(0, p.x, p.y, p.z)
            positions.setXYZ(1, n.x, n.y, n.z)
            positions.needsUpdate = true

            sendPosition([p.x, p.y, p.z], [end.x, end.y, end.z])
          }}
        >
          <meshStandardMaterial color='black' roughness={0} metalness={0.75} />
        </mesh>
      </Suspense>
      <mesh ref={mouseHelper} visible={false}>
        <boxGeometry args={[1, 1, 10]} />
        <meshNormalMaterial />
      </mesh>
      <line ref={lineRef}>
        <bufferGeometry attach='geometry' />
        <lineBasicMaterial attach='material' color='white' />
      </line>
    </>
  )
})

useGLTF.preload("/LeePerrySmith.glb")
