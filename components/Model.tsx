import { forwardRef } from "react"
import { useGLTF } from "@react-three/drei"
import { usePlayers } from "@/hooks/usePlayers"
import { Suspense, useRef } from "react"

export const Model = forwardRef(function Model(props, ref) {
  const { nodes } = useGLTF("/LeePerrySmith.glb") as any

  const mouseHelper = useRef<THREE.Mesh>(null!)

  const { sendPosition, sendSticker } = usePlayers()

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
    </>
  )
})

useGLTF.preload("/LeePerrySmith.glb")
