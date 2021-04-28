import React, { Fragment } from "react"
import { Box, Text } from "ink"
import { range } from "lodash"
import { Position } from "./Position"

export function PositionPreview({
  position,
  cursorX = -1,
  cursorY = -1,
}: {
  position: Position
  cursorX?: number
  cursorY?: number
}) {
  const extents = range(0, 8)

  return (
    <Box flexDirection="column">
      <Text>┌───┬───┬───┬───┬───┬───┬───┬───┐</Text>
      {extents.map((y) => (
        <Fragment key={y}>
          <Text>
            │
            {extents.map((x) => {
              const column = position[x]
              const piece = (column && column[y]) || null
              const isCursorOnSquare = cursorX === x && cursorY === y

              return (
                <Fragment key={x}>
                  <Text backgroundColor={isCursorOnSquare ? 'blue' : undefined}>
                    {` ${piece || ' '} `}
                  </Text>
                  │
                </Fragment>
              )
            })}
          </Text>
          {y < 7 && <Text>├───┼───┼───┼───┼───┼───┼───┼───┤</Text>}
        </Fragment>
      ))}
      <Text>└───┴───┴───┴───┴───┴───┴───┴───┘</Text>
    </Box>
  )
}
