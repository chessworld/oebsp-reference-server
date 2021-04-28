import WebSocket from "ws"

export function sendMessage<T>(
  socket: WebSocket,
  message: T | string
): Promise<void> {
  const messageString =
    typeof message === "string" ? message : JSON.stringify(message)

  if (socket.readyState === 1) {
    socket.send(messageString)
  }
  return Promise.resolve()
}
