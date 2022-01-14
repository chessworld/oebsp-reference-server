import React from "react"
import { render, useApp } from "ink"
import { Window } from "./Window"
import { Config } from "./Config"

export function showUI(config?: Config) {
  render(<Window config={config} />)
}
