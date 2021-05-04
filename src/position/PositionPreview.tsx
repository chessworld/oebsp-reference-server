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

  return (
    <Box flexDirection="column">
      <Text>
        <Light on={corners[0]}>┌</Light>───<Light on={corners[1]}>┬</Light>───
        <Light on={corners[2]}>┬</Light>───<Light on={corners[3]}>┬</Light>───
        <Light on={corners[4]}>┬</Light>───<Light on={corners[5]}>┬</Light>───
        <Light on={corners[6]}>┬</Light>───<Light on={corners[7]}>┬</Light>───
        <Light on={corners[8]}>┐</Light>
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
                    <Light on={squares[y * 8 + x]}>{piece || " "}</Light>{" "}
                  </Text>
                  │
                </Fragment>
              )
            })}
          </Text>
          {y < 7 && (
            <Text>
              <Light on={corners[y * 9 + 9]}>├</Light>───
              <Light on={corners[y * 9 + 10]}>┼</Light>───
              <Light on={corners[y * 9 + 11]}>┼</Light>───
              <Light on={corners[y * 9 + 12]}>┼</Light>───
              <Light on={corners[y * 9 + 13]}>┼</Light>───
              <Light on={corners[y * 9 + 14]}>┼</Light>───
              <Light on={corners[y * 9 + 15]}>┼</Light>───
              <Light on={corners[y * 9 + 16]}>┼</Light>───
              <Light on={corners[y * 9 + 17]}>┤</Light>
            </Text>
          )}
        </Fragment>
      ))}
      <Text>
        <Light on={corners[72]}>└</Light>───<Light on={corners[73]}>┴</Light>───
        <Light on={corners[74]}>┴</Light>───<Light on={corners[75]}>┴</Light>───
        <Light on={corners[76]}>┴</Light>───<Light on={corners[77]}>┴</Light>───
        <Light on={corners[78]}>┴</Light>───<Light on={corners[79]}>┴</Light>───
        <Light on={corners[80]}>┘</Light>
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
