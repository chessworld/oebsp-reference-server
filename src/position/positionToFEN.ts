import { Position } from "./Position"

export function positionToFEN(position: Position) {
  let s = ""
  let c = 0
  for (let y = 0; y < 8; y++) {
    if (y !== 0) {
      s += "/"
    }
    for (let x = 0; x < 8; x++) {
      const column = position[x]
      const piece = column && column[y]
      if (piece) {
        if (c > 0) {
          s += c
          c = 0
        }
        s += piece
      } else {
        c++
      }
    }
    if (c > 0) {
      s += c
      c = 0
    }
  }
  return s
}
