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
import { BoardOptions } from "./BoardOptions"

const startingPosition = positionFromFEN(
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
)

function makeBoard(): Board {
  return {
    id: last(v4().split("-")) || "",
    position: startingPosition,
    features: {
      lightCorners: false,
      lightSquares: false,
    },
    corners: new Array(81).fill(false),
    squares: new Array(64).fill(false),
  }
}

const pieceKeys = "pbnrqkPBNRQK"

function Window() {
  const [boards, setBoards] = useState<Board[]>([makeBoard()])
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [serverStatus] = useServer(boards, setBoards)

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
    } else if (key.ctrl && input.toLowerCase() === "f") {
      setIsFlipped(!isFlipped)
    } else if (pieceKeys.indexOf(input) >= 0) {
      setCurrentSquare(input)
    } else if (input === " ") {
      setCurrentSquare(null)
    } else if (input === "1") {
      setBoards(
        update(boards, {
          [selectedBoardIndex]: {
            features: {
              lightCorners: {
                $apply: (x) => !x,
              },
            },
          },
        })
      )
    } else if (input === "2") {
      setBoards(
        update(boards, {
          [selectedBoardIndex]: {
            features: {
              lightSquares: {
                $apply: (x) => !x,
              },
            },
          },
        })
      )
    }
  })

  function setCurrentSquare(value: string | null) {
    setBoards(
      update(boards, {
        [selectedBoardIndex]: {
          position: {
            [isFlipped ? 7 - cursorX : cursorX]: {
              [isFlipped ? 7 - cursorY : cursorY]: {
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
        <Box flexDirection="column">
          <BoardList boards={boards} selectedBoardIndex={selectedBoardIndex} />
          {selectedBoard && (
            <Box
              flexDirection="column"
              alignItems="center"
              borderStyle="round"
              borderColor="gray"
              padding={1}
            >
              <Text underline>Board features</Text>
              <BoardOptions board={selectedBoard} />
            </Box>
          )}
        </Box>
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
                flipped={isFlipped}
                corners={
                  selectedBoard.features.lightCorners
                    ? selectedBoard.corners
                    : undefined
                }
                squares={
                  selectedBoard.features.lightSquares
                    ? selectedBoard.squares
                    : undefined
                }
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
