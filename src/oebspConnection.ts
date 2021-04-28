import { zip } from "lodash"
import { connectionHandler } from "./connectionHandler"
import { positionToFEN } from "./position/positionToFEN"
import { Board } from "./types"

export interface OebspConnectionInterface {
  handler: any
  updateBoards(boards: Board[]): void
}

export function makeOebspConnection(
  initialBoards: Board[]
): OebspConnectionInterface {
  let boards = initialBoards
  const listeners = new Set<(oldBoards: Board[], newBoards: Board[]) => void>()

  return {
    handler: connectionHandler<any, any>(({ socket, send, req }) => {
      const listener = async (oldBoards: Board[], newBoards: Board[]) => {
        for (const [oldBoard, newBoard] of zip(oldBoards, newBoards)) {
          if (oldBoard !== newBoard && newBoard) {
            await send({
              type: "boardUpdate",
              serialNumber: newBoard.id,
              fen: positionToFEN(newBoard.position),
            })
          }
        }
      }
      const subscribedBoards = new Set()

      listeners.add(listener)

      return {
        async onMessage(message) {
          switch (message.type) {
            case "identify":
              send({
                type: "identification",
                protocol: {
                  name: "OEBSP",
                  revision: 1,
                },
              })
              break
            case "listBoards":
              send({
                type: "boardList",
                boards: boards.map((board) => ({
                  serialNumber: board.id,
                  fen: positionToFEN(board.position),
                })),
              })
              break
            case "subscribeToBoards": {
              for (const id of message.serialNumbers) {
                subscribedBoards.add(id)
                send({ type: "info", message: `Subscribed to board ${id}` })
              }
              break
            }
            case "unsubscribeFromBoards": {
              for (const id of message.serialNumbers) {
                subscribedBoards.delete(id)
              }
              break
            }
          }
        },

        async onClose() {
          listeners.delete(listener)
        },
      }
    }),

    updateBoards: (value) => {
      // console.log({ boards: value, changed: boards !== value })

      if (value !== boards) {
        const old = boards
        boards = value
        for (const listener of listeners.values()) {
          listener(old, value)
        }
      }
    },
  }
}
