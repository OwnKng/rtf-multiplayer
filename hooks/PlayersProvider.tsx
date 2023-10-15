"use client"
import usePartySocket from "partysocket/react"
import { createContext, useCallback, useEffect } from "react"
import React from "react"

type Cursor = {
  x: number
  y: number
}

type OtherCursorsMap = {
  [id: string]: Cursor
}

interface PlayersContextType {
  sendPosition: (cursor: Cursor) => void
  others: OtherCursorsMap
}

export const PlayerContext = createContext<PlayersContextType>({
  sendPosition: () => null,
  others: {},
})

export default function PlayerContextProvider(props: {
  host: string
  room: string
  children: React.ReactNode
}) {
  const socket = usePartySocket({
    host: props.host,
    room: props.room,
  })

  const [others, setOthers] = React.useState<OtherCursorsMap>({})

  useEffect(() => {
    if (socket) {
      const onMessage = (event: WebSocketEventMap["message"]) => {
        const msg = JSON.parse(event.data)

        switch (msg.type) {
          case "sync":
            const newPlayers = { ...msg.cursors }
            setOthers(newPlayers)
            break
          case "update":
            const other = {
              x: msg.x,
              y: msg.y,
              pointer: msg.pointer,
            }
            setOthers((others) => {
              const o = others[msg.id]
              const points = o?.points || []

              const newPoints = [...points, { x: msg.x, y: msg.y }].slice(-30)

              return { ...others, [msg.id]: { ...o, points: newPoints } }
            })
            break
          case "remove":
            setOthers((others) => {
              const newOthers = { ...others }
              delete newOthers[msg.id]
              return newOthers
            })
            break
        }
      }
      socket.addEventListener("message", onMessage)

      return () => {
        socket.removeEventListener("message", onMessage)
      }
    }
  }, [socket])

  const sendPosition = useCallback(
    (position: { x: number; y: number }) => {
      if (!socket) return
      socket.send(JSON.stringify(position))
    },
    [socket]
  )

  return (
    <PlayerContext.Provider value={{ sendPosition, others }}>
      {props.children}
    </PlayerContext.Provider>
  )
}
