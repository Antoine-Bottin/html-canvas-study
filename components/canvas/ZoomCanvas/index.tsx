"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import usePressedKeys from "../../../utils/key"

interface Props {
  width?: number
  height?: number
  src: string
}

const ZoomCanvas = ({ width, height, src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [scale, setScale] = useState(1)
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 })

  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const pressedKeys = usePressedKeys()

  const getMouseCoordinates = (event) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale
    return { clientX, clientY }
  }

  const handleMouseDown = () => {
    const { clientX, clientY } = getMouseCoordinates(event)
  }

  const handleMouseUp = () => {
    const { clientX, clientY } = getMouseCoordinates(event)
  }

  const handleMouseMove = () => {
    const { clientX, clientY } = getMouseCoordinates(event)
  }

  const onZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.1), 20))
  }

  const handleResetPosition = () => {
    setScale(1)
    setPanOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    const canvas = document.getElementById("zoom-canvas")
    const panOrZoomFunction = (event: WheelEvent) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control"))
        onZoom(event.deltaY > 0 ? 0.01 : -0.01)
      else {
        setPanOffset((prev) => ({
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY,
        }))
      }
    }
    canvas.addEventListener("wheel", panOrZoomFunction, { passive: true })
    return () => canvas.removeEventListener("wheel", panOrZoomFunction)
  }, [pressedKeys, scale])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)

    const scaleWidth = canvas.width * scale
    const scaleHeight = canvas.height * scale
    const scaleOffsetX = (scaleWidth - canvas.width) / 2
    const scaleOffsetY = (scaleHeight - canvas.height) / 2
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY })

    const image = new Image()
    image.src = src

    image.onload = () => {
      context.drawImage(
        image,
        panOffset.x,
        panOffset.y,
        width * scale,
        height * scale,
      )
    }

    context.translate(
      (panOffset.x / 10000) * scale - scaleOffsetX,
      (panOffset.y / 10000) * scale - scaleOffsetY,
    )

    context.scale(scale, scale)
  }, [panOffset, scale])

  return (
    <>
      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        id="zoom-canvas"
        style={{ border: "2px solid white" }}
      />
      <div>
        <button onClick={() => onZoom(-0.01)}>-</button>
        <span onClick={handleResetPosition}>{(scale * 100).toFixed(1)}%</span>
        <button onClick={() => onZoom(0.01)}>+</button>
      </div>
    </>
  )
}
export default ZoomCanvas
