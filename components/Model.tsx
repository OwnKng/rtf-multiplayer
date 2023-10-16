import * as THREE from "three"
import React, { useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"

type GLTFResult = GLTF & {
  nodes: {
    Mesh_0001: THREE.Mesh
  }
  materials: {
    ["default"]: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/bust-lo-draco.glb"
  ) as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0001.geometry}
        material={materials["default"]}
        position={[0, 0.386, 0]}
      />
    </group>
  )
}

useGLTF.preload("/bust-lo-draco.glb")
