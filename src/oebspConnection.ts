import update, { Spec } from "immutability-helper"
import { zip } from "lodash"
import { connectionHandler } from "./connectionHandler"
import { positionToFEN } from "./position/positionToFEN"
import { Board } from "./types"

export interface OebspConnectionInterface {
  handler: any
  updateBoards(boards: Board[]): void
}

export function makeOebspConnection(
  initialBoards: Board[],
  setBoards: (boards: Board[]) => void
): OebspConnectionInterface {
  let boards = initialBoards
  const listeners = new Set<(oldBoards: Board[], newBoards: Board[]) => void>()

  return {
    handler: connectionHandler<any, any>(({ socket, send, req }) => {
      const listener = async (oldBoards: Board[], newBoards: Board[]) => {
        for (const [oldBoard, newBoard] of zip(oldBoards, newBoards)) {
          if (
            newBoard &&
            subscribedBoards.has(newBoard.id) &&
            oldBoard?.position !== newBoard?.position
          ) {
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
                  features: board.features,
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
            case "lightCorners": {
              const boardIndex = boards.findIndex(
                (board) => board.id === message.serialNumber
              )
              if (boardIndex < 0) break

              const spec: Spec<Board> = {
                corners: {},
              }

              for (const item of message.corners) {
                const index = item.x + item.y * 9
                spec.corners![index] = { $set: !!item.lit }
              }

              setBoards(
                update(boards, {
                  [boardIndex]: spec,
                })
              )

              break
            }
            case "lightSquares": {
              const boardIndex = boards.findIndex(
                (board) => board.id === message.serialNumber
              )
              if (boardIndex < 0) break

              const spec: Spec<Board> = {
                squares: {},
              }

              for (const item of message.squares) {
                const index = item.x + item.y * 8
                spec.squares![index] = { $set: !!item.lit }
              }

              setBoards(
                update(boards, {
                  [boardIndex]: spec,
                })
              )

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
