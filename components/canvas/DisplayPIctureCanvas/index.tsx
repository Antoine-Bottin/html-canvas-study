"use client"
import { useLayoutEffect, useRef, useState } from "react"
import createImage from "../../../utils/canvas"

interface Props {
  width?: number
  height?: number
  src: string
}

const DisplayPictureCanvas = ({ width, height, src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    createImage(context, src, canvas)
    context.globalCompositeOperation = "destination-over"
    //Drawing black line
    context.beginPath() // Start a new path
    context.lineWidth = 5
    context.moveTo(canvas.width / 2, 0) // Move the pen to (30, 50)
    context.lineTo(canvas.width / 2, canvas.height) // Draw a line to (150, 100)
    context.stroke() // Render the path
  }, [])

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={width}
      style={{ border: "2px solid white" }}
    />
  )
}
export default DisplayPictureCanvas
