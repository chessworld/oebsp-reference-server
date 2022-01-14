import { showUI } from "./ui"
import { readFileSync } from "fs"

let config: any = undefined

if (process.argv.length > 2) {
  const configFilename = process.argv[2]

  if (configFilename) {
    config = JSON.parse(readFileSync(configFilename, "utf8"))
  }
}

showUI(config)
