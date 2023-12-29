"use client"
import { useLayoutEffect, useRef, useState } from "react"
import createImage from "../../../utils/canvas"

interface Props {
  width?: number
  height?: number
  src: string
}

const ExportFileCanvas = ({ width, height, src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleExportCanvasAsPNG = (id, fileName) => {
    var canvasElement = document.getElementById(id) as HTMLCanvasElement

    var MIME_TYPE = "image/png"

    var imgURL = canvasElement.toDataURL(MIME_TYPE)

    var dlLink = document.createElement("a")
    dlLink.download = fileName
    dlLink.href = imgURL
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(
      ":",
    )

    document.body.appendChild(dlLink)
    dlLink.click()
    document.body.removeChild(dlLink)
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    createImage(context, src, canvas)
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        id="export-canvas"
        height={height}
        width={width}
        style={{ border: "2px solid white" }}
      />
      <button
        onClick={() => handleExportCanvasAsPNG("export-canvas", "export ")}
      >
        Export file
      </button>
    </>
  )
}
export default ExportFileCanvas
