import { useEffect, useRef, useState } from "react"
import express, { json } from "express"
import expressWs from "express-ws"
import http from "http"

export function useServer() {
  const serverRef = useRef<http.Server>()
  const [serverStatus, setServerStatus] = useState("Starting...")

  const serverPort = 1982

  useEffect(() => {
    const baseApp = express()
    baseApp.use(json())

    const server = http.createServer(baseApp)

    const wsInstance = expressWs(baseApp, server)
    wsInstance.getWss().on("error", (e) => {
      setServerStatus(`Error: [${e.name}] ${e.message}`)
    })

    const { app } = wsInstance

    app.get("/", (_, res) => {
      res.statusCode = 200
      res.send("OK")
    })

    new Promise<void>((resolve) => {
      server.listen(serverPort, () => resolve())
    }).then(() => {
      setServerStatus(`Listening on ws://localhost:${serverPort}/`)
    })

    serverRef.current = server
  })

  return [serverStatus]
}
