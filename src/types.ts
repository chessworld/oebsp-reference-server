import { Position } from "./position/Position"

export interface Board {
  id: string
  position: Position
  features: {
    lightCorners: boolean
    lightSquares: boolean
  }
  corners: boolean[]
  squares: boolean[]
}
