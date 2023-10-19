"use client"
import usePartySocket from "partysocket/react"
import { createContext, useCallback, useEffect, useState } from "react"
import { MathUtils } from "three"

type Cursor = {
  start: [number, number, number]
  end: [number, number, number]
}

type OtherCursorsMap = {
  [id: string]: Cursor
}

type Sticker = {
  position: [number, number, number]
  rotation: [number, number, number]
  sticker: string
}

type OtherStickersMap = {
  [id: string]: Sticker
}

interface PlayersContextType {
  sendPosition: (
    start: [number, number, number],
    end: [number, number, number]
  ) => void
  others: OtherCursorsMap
  sendSticker: (
    position: [number, number, number],
    rotation: [number, number, number],
    sticker: string
  ) => void
  stickers: OtherStickersMap
}

export const PlayerContext = createContext<PlayersContextType>({
  sendPosition: () => null,
  others: {},
  sendSticker: () => null,
  stickers: {},
})

export default function PlayerContextProvider(props: {
  host: string
  room: string
  children: React.ReactNode
}) {
  const socket = usePartySocket({
    host: props.host,
    room: props.room,
    party: "cursors",
  })

  const stickersSocket = usePartySocket({
    host: props.host,
    room: props.room,
  })

  const [others, setOthers] = useState<OtherCursorsMap>({})

  const [stickers, setStickers] = useState<OtherStickersMap>({})

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
            setOthers((others) => ({
              ...others,
              [msg.id]: { start: msg.start, end: msg.end },
            }))
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
    if (stickersSocket) {
      const onMessage = (event: WebSocketEventMap["message"]) => {
        const msg = JSON.parse(event.data)

        switch (msg.type) {
          case "sync":
            const newStickers = { ...msg.stickers }
            setStickers(newStickers)
            break
          case "update":
            const id = MathUtils.generateUUID()

            setStickers((stickers) => ({
              ...stickers,
              [id]: {
                position: msg.position,
                rotation: msg.rotation,
                sticker: msg.sticker,
              },
            }))
            break
          case "remove":
            setStickers((stickers) => {
              const newStickers = { ...stickers }
              delete newStickers[msg.id]
              return newStickers
            })
            break
        }
      }
      stickersSocket.addEventListener("message", onMessage)

      return () => {
        stickersSocket.removeEventListener("message", onMessage)
      }
    }
  }, [stickersSocket])

  const sendPosition = useCallback(
    (start: [number, number, number], end: [number, number, number]) => {
      if (!socket) return
      socket.send(JSON.stringify({ start, end }))
    },
    [socket]
  )

  const sendSticker = useCallback(
    (
      position: [number, number, number],
      rotation: [number, number, number],
      sticker: string
    ) => {
      if (!stickersSocket) return
      stickersSocket.send(JSON.stringify({ position, rotation, sticker }))
    },
    [stickersSocket]
  )

  return (
    <PlayerContext.Provider
      value={{ sendPosition, others, sendSticker, stickers }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}
