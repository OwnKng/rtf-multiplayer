import SocketWrapper from "@/components/SocketWrapper"
import Cursors from "@/components/Cursors"

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <SocketWrapper>
        <Cursors />
      </SocketWrapper>
    </div>
  )
}
