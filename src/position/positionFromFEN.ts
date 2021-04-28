import { Position } from "./Position"
import { makePosition } from "./makePosition"

export function positionFromFEN(fen: string): Position {
  let blankSpace = 0

  // Remove excess whitespace
  fen = fen.replace(/\s+/g, " ")
  fen = fen.replace(/(^\s+)|(\s+$)/g, "")

  let position = makePosition()

  // Extract piece placement
  fen.split("/").forEach((row, y) => {
    blankSpace = 0
    row.split("").forEach((letter, x) => {
      if (letter.match(/\d/)) {
        blankSpace += Number(letter) - 1
      } else if (letter.match(/[PRNBQKprnbqk]/)) {
        position[blankSpace + x]![y] = letter
      }
    })
  })

  return position
}
