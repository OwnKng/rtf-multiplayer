import Playspace from "@/components/Playspace"
import React from "react"
import PlayersContextProvider from "../hooks/PlayersProvider"

const hostURL = process.env.PARTYURL as string

export default function App() {
  return (
    <PlayersContextProvider host={hostURL} room='threejs'>
      <Playspace />
    </PlayersContextProvider>
  )
}
