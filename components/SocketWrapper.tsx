"use client"

import React from "react"
import PlayersContextProvider from "../hooks/PlayersProvider"

export default function CursorWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlayersContextProvider host='localhost:1999' room='test'>
      {children}
    </PlayersContextProvider>
  )
}
