import React from "react"
import { Text, Box } from "ink"

export function Legend() {
  return (
    <Text wrap="wrap">
      <LegendKey code="^X" label="Exit" />
      <LegendKey code="[/]" label="Select board" />
      <LegendKey code="Arrows" label="Select square" />
      <LegendKey code="p/n/b/r/q/k" label="Set piece" />
      <LegendKey code="SPACE" label="Clear piece" />
      <LegendKey code="^R" label="Reset board" />
      <LegendKey code="^F" label="Flip board" />
    </Text>
  )
}

function LegendKey({ code, label }: { code: string; label: string }) {
  return (
    <Text>
      <Text backgroundColor="white" color="black">
        {code}
      </Text>
      {` ${label} `}
    </Text>
  )
}
