"use client"

import { useMemo } from "react"
import * as THREE from "three"

export const useEmojiTextures = (emojis: string[]) => {
  const textures = useMemo(() => {
    const textureArray = []

    for (let i = 0; i < emojis.length; i++) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!

      canvas.width = 256
      canvas.height = 256

      context.font = "220px serif"

      context.textAlign = "center"
      context.textBaseline = "middle"

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillText(emojis[i], canvas.width / 2, canvas.height / 2)

      textureArray[i] = new THREE.CanvasTexture(canvas)
    }

    return textureArray
  }, [emojis])

  return textures.length === 1 ? textures[0] : textures
}
