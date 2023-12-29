"use client"
import { useLayoutEffect, useRef, useState } from "react"
import createImage from "../../../utils/canvas"

interface Props {
  width?: number
  height?: number
  src: string
}

const FiltersCanvas = ({ width, height, src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [chosenFilters, setChosenFilters] = useState("")
  console.log(chosenFilters)

  let result = ""

  const handleFilters = (filterName, value) => {
    switch (filterName) {
      case "blur":
        result = `blur(${value}px)`
        break
      case "brightness":
        result = `brightness(${value})`
        break
      case "contrast":
        result = `contrast(${value}%)`
        break
      case "drop-shadow":
        result = `drop-shadow(${value})`
        break
      case "grayscale":
        result = `grayscale(${value}%)`
        break
      case "hue-rotate":
        result = `hue-rotate(${value}deg)`
        break
      case "invert":
        result = `invert(${value}%)`
        break
      case "opacity":
        result = `opacity(${value}%)`
        break
      case "saturate":
        result = `saturate(${value}%)`
        break
      case "sepia":
        result = `sepia(${value}%)`
        break
      case "url":
        result = `url(${value})`
        break
      case "sepia":
      default:
        break
    }
    setChosenFilters((prev) => prev.concat(result, " "))
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    createImage(context, src, canvas)
    context.filter = chosenFilters
  }, [chosenFilters])

  const handleResetFilter = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.filter = "none"
    setChosenFilters("")
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        id="export-canvas"
        height={height}
        width={width}
        style={{ border: "2px solid white" }}
      />
      <div>
        <button onClick={() => handleFilters("blur", "4")}>Blur</button>
        <button onClick={() => handleFilters("brightness", "0.4")}>
          Brightness
        </button>
        <button onClick={() => handleFilters("contrast", "200")}>
          Contrast
        </button>
        <button
          onClick={() => handleFilters("drop-shadow", "16px 16px 20px blue")}
        >
          Drop Shadow
        </button>
      </div>
      <div>
        <button onClick={() => handleFilters("grayscale", "10")}>
          Grayscale
        </button>
        <button onClick={() => handleFilters("hue-rotate", "35")}>
          Hue rotate
        </button>
        <button onClick={() => handleFilters("invert", "25")}>Invert</button>
        <button onClick={() => handleFilters("opacity", "95")}>Opacity</button>
        <div>
          <button onClick={() => handleFilters("saturate", "20")}>
            Saturate
          </button>
          <button onClick={() => handleFilters("sepia", "70")}>Sepia</button>
          <button onClick={() => handleFilters("url", "#perso")}>Perso</button>
        </div>
      </div>
      <button onClick={handleResetFilter}>Reset filters</button>
    </>
  )
}
export default FiltersCanvas
// turb     svg-blur   discrete half
