import WebSocket from "ws"
import express from "express"
import { sendMessage } from "./sendMessage"

type PongMesssage = { type: "pong" }

export const checkConnectionTimeoutMs = 10 * 1000
export const connectionTimeoutMs = 30 * 1000

type ConnectionHandlerContext<ServerMessage> = {
  socket: WebSocket
  req: express.Request
  send(message: ServerMessage | PongMesssage | string): Promise<void>
}

type ConnectionHandlerDefinition<ServerMessage, ClientMessage> = (
  context: ConnectionHandlerContext<ServerMessage>
) => {
  onMessage?(message: ClientMessage): Promise<void>
  onClose?(): Promise<void>
  onError?(error: Error): Promise<void>
}

export function connectionHandler<ServerMessage, ClientMessage>(
  def: ConnectionHandlerDefinition<ServerMessage, ClientMessage>
) {
  return function (socket: WebSocket, req: express.Request) {
    try {
      let lastMessageTimestampMs = new Date().getTime()
      let timeoutInterval: NodeJS.Timeout | undefined
      // let trouble = 0

      const send = async (message: ServerMessage | PongMesssage | string) => {
        // Uncomment to simulate connection timeout
        //
        // trouble++
        // console.warn(`Trouble: ${trouble}`)
        // if (trouble >= 10) return

        await sendMessage(socket, message)
      }

      const clearTimeoutInterval = () => {
        if (!timeoutInterval) return

        clearInterval(timeoutInterval)
        timeoutInterval = undefined
      }

      const checkTimeout = () => {
        if (!timeoutInterval) return

        // console.info(`lastMessageTimestampMs: ${lastMessageTimestampMs}`)
        const now = new Date().getTime()
        const old = now - connectionTimeoutMs
        if (lastMessageTimestampMs < old) {
          clearTimeoutInterval()
          if (socket.readyState === WebSocket.OPEN) {
            socket.close(1000, "Server timeout")
          }
        }
      }

      const setTimeoutInterval = () => {
        if (timeoutInterval) return
        timeoutInterval = setInterval(checkTimeout, checkConnectionTimeoutMs)
      }

      setTimeoutInterval()

      const { onMessage, onClose, onError } = def({ socket, send, req })

      socket.on("error", (e) => {
        console.warn(`WebSocket internal error -- [${e.name}] ${e.message}`)
      })

      if (onMessage) {
        socket.on("message", async (msg) => {
          if (typeof msg !== "string") return

          try {
            const message = JSON.parse(msg)

            lastMessageTimestampMs = new Date().getTime()
            if (message.type === "ping") {
              send({ type: "pong" })
            } else {
              await onMessage(message)
            }
          } catch (e) {
            if (onError) {
              try {
                await onError(e)
              } catch (e) {
                console.error("Error in error handler", e)
              }
            }
            console.error("Error on socket message", e)
          }
        })
      }

      if (onClose) {
        socket.on("close", async () => {
          clearTimeoutInterval()
          try {
            await onClose()
          } catch (e) {
            console.error("Error on socket close", e)
          }
        })
      }
    } catch (e) {
      console.error("Error initializing connection handler", e)
    }
  }
}
