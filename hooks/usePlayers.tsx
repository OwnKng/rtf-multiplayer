"use client"

import { useContext } from "react"
import { PlayerContext } from "./PlayersProvider"

export const usePlayers = () => useContext(PlayerContext)
