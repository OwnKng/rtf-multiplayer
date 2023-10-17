import { forwardRef, useLayoutEffect } from "react"
import { Vector3 } from "three"

import { extend } from "@react-three/fiber"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"

extend({ MeshLineGeometry, MeshLineMaterial })

export const Cursor = forwardRef(function Cursor(props, ref) {
  return (
    <group>
      <mesh ref={ref} {...props} renderOrder={999} castShadow>
        <meshLineGeometry />
        <meshLineMaterial lineWidth={0.1} color='#F22B29' />
      </mesh>
    </group>
  )
})
