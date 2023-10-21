import { useRef } from "react"
import * as THREE from "three"
import { usePlayers } from "@/hooks/usePlayers"
import { Decal, useGLTF } from "@react-three/drei"
import { Model } from "./Model"
import { emojis } from "@/utils"
import { useEmojiTextures } from "@/hooks/useEmojiTextures"

export default function Scene({ sticker }: { sticker: string }) {
  const textures = useEmojiTextures(emojis.map((e) => e.unicode))

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
          renderOrder={Object.entries(stickers).length - i}
          mesh={meshRef}
          map={textures.find((t) => t.name === sticker.sticker)}
        />
      ))}
    </>
  )
}
