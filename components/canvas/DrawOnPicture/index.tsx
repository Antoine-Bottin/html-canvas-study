"use client"
import { useLayoutEffect, useRef, useState } from "react"

import rough from "roughjs"
import createImage from "../../../utils/canvas"

const generator = rough.generator()

interface Props {
  width?: number
  height?: number
  src?: string
}

const DrawOnPictureCanvas = ({ width, height, src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [elements, setElements] = useState([])
  const [drawing, setDrawing] = useState(false)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    createImage(context, src, canvas)
    context.globalCompositeOperation = "destination-over"

    const roughCanvas = rough.canvas(canvas)

    elements.forEach(({ roughElement }) => {
      roughCanvas.draw(roughElement)
    })
  }, [elements, canvasRef.current?.scrollTop])

  const createElement = (x1, y1, x2, y2) => {
    const canvas = canvasRef.current
    const { offsetTop, offsetLeft } = canvas

    const roughElement = generator.line(
      x1 - offsetLeft,
      y1 - offsetTop,
      x2 - offsetLeft,
      y2 - offsetTop,
      {
        strokeWidth: 5,
        stroke: "#FFF",
      },
    )
    return { x1, y1, x2, y2, roughElement }
  }

  const handleMouseDown = (event) => {
    setDrawing(true)
    const { clientX, clientY } = event
    console.log(clientY)

    const element = createElement(
      clientX + window.scrollX,
      clientY + window.scrollY,
      clientX + window.scrollX,
      clientY + window.scrollY,
    )
    setElements((prevState) => [...prevState, element])
  }

  const handleMouseMove = (event) => {
    if (!drawing) return
    const { clientX, clientY } = event
    const index = elements.length - 1
    const { x1, y1 } = elements[index]
    const updatedElement = createElement(
      x1,
      y1,
      clientX + window.scrollX,
      clientY + window.scrollY,
    )

    const elementsCopy = [...elements]
    elementsCopy[index] = updatedElement
    setElements(elementsCopy)
  }

  const handleMouseUp = () => {
    setDrawing(false)
  }

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={width}
      style={{ border: "2px solid white" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  )
}
export default DrawOnPictureCanvas
