import { last } from "lodash"
import { Board } from "./types"
import { v4 } from "uuid"
import { positionFromFEN } from "./position/positionFromFEN"

type BoardOptions = Partial<Board> & {
  fen?: string
}

export function makeBoard(options: BoardOptions): Board {
  return {
    id: last(v4().split("-")) || "",
    position: positionFromFEN(options.fen || startingFEN),
    features: {
      lightCorners: false,
      lightSquares: false,
    },
    corners: new Array(81).fill(false),
    squares: new Array(64).fill(false),
    ...options,
  }
}

const startingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

export const startingPosition = positionFromFEN(
 startingFEN 
)
