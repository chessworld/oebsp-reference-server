import React from "react"
import { Board } from "./types"
import { Box, Text } from "ink"

interface Props {
  board: Board
}

export function BoardOptions({ board }: Props) {
  return (
    <Box marginTop={1} flexDirection="column">
      <Text>
        [1] Light corners - <Toggle on={board.features.lightCorners} />
      </Text>
      <Text>
        [2] Light squares - <Toggle on={board.features.lightSquares} />
      </Text>
    </Box>
  )
}

function Toggle({ on = false }: { on?: boolean }) {
  return on ? <Text color="green">On</Text> : <Text color="red">Off</Text>
}
