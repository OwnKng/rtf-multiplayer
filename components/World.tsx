import { Canvas } from "@react-three/fiber"
import Player from "./Player"
import Players from "./Players"

export default function World() {
  return (
    <Canvas>
      <Player />
      <Players />
    </Canvas>
  )
}
