import { useEffect, useRef, useState } from "react"
import express, { json } from "express"
import expressWs from "express-ws"
import { Board } from "./types"
import {
  makeOebspConnection,
  OebspConnectionInterface,
} from "./oebspConnection"

export function useServer(boards: Board[]) {
  const ifaceRef = useRef<OebspConnectionInterface>()
  const [serverStatus, setServerStatus] = useState("Starting...")

  const serverPort = Number(process.env.PORT || 1982)

  useEffect(() => {
    const baseApp = express()
    baseApp.use(json())

    const wsInstance = expressWs(baseApp)
    wsInstance.getWss().on("error", (e) => {
      //  if (e.message.indexOf("EADDRINUSE") < 0) {
      setServerStatus(`Error: [${e.name}] ${e.message}`)
      //s     }
    })

    const { app } = wsInstance

    app.get("/", (_, res) => {
      res.statusCode = 200
      res.send("OK")
    })

    const iface = makeOebspConnection(boards)

    app.ws("/oebsp", iface.handler)

    new Promise<void>((resolve) => {
      app.listen(serverPort, () => resolve())
    }).then(() => {
      setServerStatus(`Listening on ws://localhost:${serverPort}/`)
    })

    ifaceRef.current = iface
  }, [])

  useEffect(() => {
    ifaceRef.current?.updateBoards(boards)
  }, [ifaceRef.current, boards])

  return [serverStatus]
}
