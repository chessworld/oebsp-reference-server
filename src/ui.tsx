import React, { useState } from "react"
import { last } from "lodash"
import { render, Text, Box, useInput, useApp } from "ink"
import { Board } from "./types"
import { useServer } from "./useServer"
import { v4 } from "uuid"
import { positionFromFEN } from "./position/positionFromFEN"
import { BoardList } from "./BoardList"
import { PositionPreview } from "./position/PositionPreview"
import { Legend } from "./Legend"
import update from "immutability-helper"

const startingPosition = positionFromFEN(
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
)

function makeBoard(): Board {
  return {
    id: last(v4().split("-")) || "",
    position: startingPosition,
  }
}

const pieceKeys = "pbnrqkPBNRQK"

function Window() {
  const [boards, setBoards] = useState<Board[]>([makeBoard()])
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0)
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [serverStatus] = useServer()

  useInput((input, key) => {
    if (key.leftArrow) {
      setCursorX(cursorX <= 0 ? 7 : cursorX - 1)
    } else if (key.rightArrow) {
      setCursorX(cursorX >= 7 ? 0 : cursorX + 1)
    } else if (key.upArrow) {
      setCursorY(cursorY <= 0 ? 7 : cursorY - 1)
    } else if (key.downArrow) {
      setCursorY(cursorY >= 7 ? 0 : cursorY + 1)
    } else if (key.ctrl && input.toLowerCase() === "x") {
      process.exit(0)
    } else if (key.ctrl && input.toLowerCase() === "r") {
      setBoards(
        update(boards, {
          [selectedBoardIndex]: {
            position: { $set: startingPosition },
          },
        })
      )
    } else if (pieceKeys.indexOf(input) >= 0) {
      setCurrentSquare(input)
    } else if (input === " ") {
      setCurrentSquare(null)
    }
  })

  function setCurrentSquare(value: string | null) {
    setBoards(
      update(boards, {
        [selectedBoardIndex]: {
          position: {
            [cursorX]: {
              [cursorY]: {
                $set: value,
              },
            },
          },
        },
      })
    )
  }

  const selectedBoard = boards[selectedBoardIndex]

  return (
    <Box flexDirection="column" alignItems="stretch" width="100%">
      <Text>Server status: {serverStatus}</Text>
      <Box flexDirection="row">
        <BoardList boards={boards} selectedBoardIndex={selectedBoardIndex} />
        {selectedBoard && (
          <Box
            borderStyle="round"
            borderColor="gray"
            padding={1}
            flexDirection="column"
            alignItems="stretch"
          >
            <Box flexDirection="column" alignItems="center">
              <Text underline>Board - {selectedBoard.id}</Text>
              <PositionPreview
                position={selectedBoard.position}
                cursorX={cursorX}
                cursorY={cursorY}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Legend />
    </Box>
  )
}

export function showUI() {
  render(<Window />)
}
