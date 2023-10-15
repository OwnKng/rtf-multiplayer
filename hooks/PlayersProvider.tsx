"use client"
import usePartySocket from "partysocket/react"
import { createContext, useEffect } from "react"
import React from "react"

type Cursor = {
  x: number
  y: number
}

type OtherCursorsMap = {
  [id: string]: Cursor
}

interface PlayersContextType {
  self: Cursor | null
  others: OtherCursorsMap
}

export const PlayerContext = createContext<PlayersContextType>({
  self: null,
  others: {},
})

export default function PlayerContextProvider(props: {
  host: string
  room: string
  children: React.ReactNode
}) {
  const [self, setSelf] = React.useState<Cursor | null>(null)
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

  const socket = usePartySocket({
    host: props.host,
    room: props.room,
  })

  const [others, setOthers] = React.useState<OtherCursorsMap>({})

  console.log(others)

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
              country: msg.country,
              lastUpdate: msg.lastUpdate,
              pointer: msg.pointer,
            }
            setOthers((others) => ({ ...others, [msg.id]: other }))
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

  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!socket) return
      if (!dimensions.width || !dimensions.height) return

      const position = {
        x: event.clientX / dimensions.width,
        y: event.clientY / dimensions.height,
      }
      socket.send(JSON.stringify(position))
    }
    window.addEventListener("mousemove", onMouseMove)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [socket, dimensions])

  return (
    <PlayerContext.Provider value={{ self, others }}>
      {props.children}
    </PlayerContext.Provider>
  )
}
