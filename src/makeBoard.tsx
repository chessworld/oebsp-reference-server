import { last } from "lodash"
import { Board } from "./types"
import { v4 } from "uuid"
import { positionFromFEN } from "./position/positionFromFEN"

export function makeBoard(options: Partial<Board>): Board {
  return {
    id: last(v4().split("-")) || "",
    position: startingPosition,
    features: {
      lightCorners: false,
      lightSquares: false,
    },
    corners: new Array(81).fill(false),
    squares: new Array(64).fill(false),
    ...options,
  }
}
export const startingPosition = positionFromFEN(
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
)
