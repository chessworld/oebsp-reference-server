import React, { Fragment } from "react"
import { Box, Text } from "ink"
import { range } from "lodash"
import { Position } from "./Position"

export function PositionPreview({
  position,
  cursorX = -1,
  cursorY = -1,
  flipped = false,
  corners = [],
  squares = [],
}: {
  position: Position
  cursorX?: number
  cursorY?: number
  flipped?: boolean
  corners?: boolean[]
  squares?: boolean[]
}) {
  const extents = range(0, 8)

  const readCorner = (x: number, y: number) =>
    corners[flipped ? 80 - (x + y * 9) : x + y * 9]
  const readSquare = (x: number, y: number) =>
    squares[flipped ? 63 - (x + y * 8) : x + y * 8]

  return (
    <Box flexDirection="column">
      <Text>
        <Light on={readCorner(0, 0)}>┌</Light>───
        <Light on={readCorner(1, 0)}>┬</Light>───
        <Light on={readCorner(2, 0)}>┬</Light>───
        <Light on={readCorner(3, 0)}>┬</Light>───
        <Light on={readCorner(4, 0)}>┬</Light>───
        <Light on={readCorner(5, 0)}>┬</Light>───
        <Light on={readCorner(6, 0)}>┬</Light>───
        <Light on={readCorner(7, 0)}>┬</Light>───
        <Light on={readCorner(8, 0)}>┐</Light>
      </Text>
      {extents.map((y) => (
        <Fragment key={y}>
          <Text>
            │
            {extents.map((x) => {
              const column = position[flipped ? 7 - x : x]
              const piece = (column && column[flipped ? 7 - y : y]) || null
              const isCursorOnSquare = cursorX === x && cursorY === y

              return (
                <Fragment key={x}>
                  <Text backgroundColor={isCursorOnSquare ? "blue" : undefined}>
                    {" "}
                    <Light on={readSquare(x, y)}>{piece || " "}</Light>{" "}
                  </Text>
                  │
                </Fragment>
              )
            })}
          </Text>
          {y < 7 && (
            <Text>
              <Light on={readCorner(0, y + 1)}>├</Light>───
              <Light on={readCorner(1, y + 1)}>┼</Light>───
              <Light on={readCorner(2, y + 1)}>┼</Light>───
              <Light on={readCorner(3, y + 1)}>┼</Light>───
              <Light on={readCorner(4, y + 1)}>┼</Light>───
              <Light on={readCorner(5, y + 1)}>┼</Light>───
              <Light on={readCorner(6, y + 1)}>┼</Light>───
              <Light on={readCorner(7, y + 1)}>┼</Light>───
              <Light on={readCorner(8, y + 1)}>┤</Light>
            </Text>
          )}
        </Fragment>
      ))}
      <Text>
        <Light on={readCorner(0, 8)}>└</Light>───
        <Light on={readCorner(1, 8)}>┴</Light>───
        <Light on={readCorner(2, 8)}>┴</Light>───
        <Light on={readCorner(3, 8)}>┴</Light>───
        <Light on={readCorner(4, 8)}>┴</Light>───
        <Light on={readCorner(5, 8)}>┴</Light>───
        <Light on={readCorner(6, 8)}>┴</Light>───
        <Light on={readCorner(7, 8)}>┴</Light>───
        <Light on={readCorner(8, 8)}>┘</Light>
      </Text>
    </Box>
  )
}

function Light({
  on = false,
  children,
}: {
  on?: boolean
  children: React.ReactNode
}) {
  return on ? (
    <Text backgroundColor="redBright">{children}</Text>
  ) : (
    <Text>{children}</Text>
  )
}
