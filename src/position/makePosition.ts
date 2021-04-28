import { Position } from "./Position"

export function makePosition(): Position {
  return new Array(8).fill(undefined).map(() => new Array(8).fill(null))
}
