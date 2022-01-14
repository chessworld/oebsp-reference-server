import { Board } from "./types"

export interface Config {
  boards: Partial<Board>[]
}

export const defaultConfig: Config = {
  boards: [{}],
}
