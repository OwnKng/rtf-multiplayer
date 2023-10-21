import { useRef } from "react"
import * as THREE from "three"
import { usePlayers } from "@/hooks/usePlayers"
import { Decal } from "@react-three/drei"
import { Model } from "./Model"
import { emojis } from "@/utils"
import { useEmojiTextures } from "@/hooks/useEmojiTextures"

export default function ModelWithDecals({ sticker }: { sticker: string }) {
  const textures = useEmojiTextures(
    emojis.map((e) => e.unicode)
  ) as THREE.CanvasTexture[]

  const meshRef = useRef<THREE.Mesh>(null!)

  const { stickers } = usePlayers()

  return (
    <>
      <Model ref={meshRef} sticker={sticker} />
      {Object.entries(stickers).map(([id, sticker], i) => (
        <Decal
          key={id}
          position={sticker.position}
          rotation={sticker.rotation}
          renderOrder={i}
          mesh={meshRef}
          scale={[0.5, 0.5, 0.5]}
        >
          <meshBasicMaterial
            attach='material'
            transparent
            map={textures.find((t) => t.name === sticker.sticker)}
            polygonOffsetFactor={-4}
            polygonOffset={true}
            depthTest={true}
            depthWrite={false}
          />
        </Decal>
      ))}
    </>
  )
}
