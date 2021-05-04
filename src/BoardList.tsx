import React from "react"
import { Text, Box } from "ink"
import { Board } from "./types"

export function BoardList({
  boards,
  selectedBoardIndex,
}: {
  boards: Board[]
  selectedBoardIndex: number
}) {
  return (
    <Box
      flexGrow={1}
      flexDirection="column"
      alignItems="stretch"
      borderStyle="round"
      borderColor="gray"
      padding={1}
    >
      <Box flexDirection="column" alignItems="center" marginBottom={1}>
        <Text underline>Boards</Text>
      </Box>
      {boards.map((board, i) => (
        <Box key={board.id}>
          {selectedBoardIndex === i ? (
            <Text color="yellow">* </Text>
          ) : (
            <Text>{"  "}</Text>
          )}
          <Text>{board.id}</Text>
        </Box>
      ))}
    </Box>
  )
}
