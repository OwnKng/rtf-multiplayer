import { forwardRef } from "react"

import { extend } from "@react-three/fiber"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"

extend({ MeshLineGeometry, MeshLineMaterial })

export const Cursor = forwardRef(function Cursor(props, ref) {
  return (
    <mesh ref={ref} {...props} renderOrder={999} castShadow>
      <meshLineGeometry />
      <meshLineMaterial lineWidth={0.1} color='#F22B29' />
    </mesh>
  )
})
