"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import usePressedKeys from "../../../utils/key"

interface Props {
  src1?: string
  src2?: string
}

const HALF_PICTURE_WIDTH = 457

const DEFAULT_VALUES = { x: 0, y: 0 }

const ZOOM_INCREMENTATION = 0.01
const MAXIMUM_ZOOM_SCALE = 5
const MINIMUM_ZOOM_SCALE = 0.1

/*
TODO: 
- Fix offset between the  picture left edge and the black line when moving the cursor on the black line and zooming.
- Find a way to dynamicaly define size width and height before canvas is drawing instead of harcodes HALF_PICTURE_WIDTH=457
- Fix black line height when zooming 
- Improve badges size when zooming in the picture.
- Idem for black cursor behaviour
- All screen scroll when scroll inside the canvas
*/

const AdvancedCanvas = ({ src1, src2 }: Props) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null)

  const [panOffset, setPanOffset] = useState(DEFAULT_VALUES)

  const [scale, setScale] = useState(1)

  const [scaleOffset, setScaleOffset] = useState(DEFAULT_VALUES)

  const [pictureSize, setPictureSize] = useState(DEFAULT_VALUES)

  const [linePosition, setLinePosition] = useState(HALF_PICTURE_WIDTH)

  const [isPanInputUsed, setIsPanInputUsed] = useState(false)

  const [isMainCursorUsed, setIsMainCursorUsed] = useState(false)

  const [isDraggable, setIsDraggable] = useState(false)

  const [isDragging, setIsDragging] = useState(false)

  const pressedKeys = usePressedKeys()

  const onZoom = (delta: number) => {
    setScale((prev) =>
      Math.min(Math.max(prev + delta, MINIMUM_ZOOM_SCALE), MAXIMUM_ZOOM_SCALE),
    )
  }

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current

    const panOrZoomFunction = (event: WheelEvent) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control"))
        onZoom(event.deltaY > 0 ? ZOOM_INCREMENTATION : -ZOOM_INCREMENTATION)
      else {
        setIsPanInputUsed(false)
        setIsMainCursorUsed(false)
        setLinePosition(HALF_PICTURE_WIDTH)

        setPanOffset((prev) => ({
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY,
        }))
      }
    }
    mainCanvas.addEventListener("wheel", panOrZoomFunction, { passive: true })
    return () => mainCanvas.removeEventListener("wheel", panOrZoomFunction)
  }, [pictureSize.y, pressedKeys, scale])

  useLayoutEffect(() => {
    const mainCanvas = mainCanvasRef.current
    const mainContext = mainCanvas.getContext("2d")

    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

    const scaleWidth = mainCanvas.width * scale
    const scaleHeight = mainCanvas.height * scale
    const scaleOffsetX = (scaleWidth - mainCanvas.width) / 2
    const scaleOffsetY = (scaleHeight - mainCanvas.height) / 2
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY })

    var img1 = new Image()
    img1.onload = draw
    img1.src = src1

    var img2 = new Image()
    img2.onload = draw
    img2.src = src2

    setPictureSize({ x: img1.height, y: img1.width })

    function draw() {
      mainCanvas.width = img1.width
      mainCanvas.height = img1.width

      // first pass draw everything
      mainContext.drawImage(
        img1,
        panOffset.x * scale,
        panOffset.y * scale,
        img1.width * scale,
        img1.height * scale,
      )

      // next drawings will be second picture
      // draw the canvas over itself, cropping to our required rect
      mainContext.drawImage(
        //Un élément à dessiner dans le contexte. La spécification autorise toute source d'image canvas
        img2,

        //La coordonnée x du bord en haut à gauche de la partie de l'image source à dessiner dans le contexte du canvas.

        //- panOffset.x - scaleOffset.x / scale
        isPanInputUsed || isMainCursorUsed
          ? linePosition / scale
          : img1.width / 2 - panOffset.x - scaleOffset.x / scale,
        //La coordonnée y du bord en haut à gauche de la partie de l'image source à dessiner dans le contexte du canvas.
        -panOffset.y,

        //La largeur de la partie de l'image source à dessiner dans le contexte. Si ce n'est pas spécifié, cet argument prend la valeur de la largeur de l'image moins sx, autrement dit l'image dessinée dans le contexte sera la partie de l'image d'origine à partir du point s de coordonnées (sx ; sy) et jusqu'au bord en bas à droite.
        isPanInputUsed || isMainCursorUsed ? img1.width : img1.width / 2,

        //La hauteur de la partie de l'image source à dessiner dans le contexte. De la même manière que pour sLargeur, si aucune valeur n'est donnée cet argument prendra la valeur de la hauteur de l'image moins sy.
        img1.height,

        //La coordonnée x dans le canvas de destination où placer le coin supérieur gauche de l'image source.
        isPanInputUsed || isMainCursorUsed ? linePosition : img1.width / 2,

        //La coordonnée y dans le canvas de destination où placer le coin supérieur gauche de l'image source.
        0,

        //La largeur de l'image dessinée dans le contexte de la balise canvas. Cela permet d'ajuster la taille de l'image. Si cet argument n'est pas spécifié, l'image prendra sa largeur normale.
        isPanInputUsed || isMainCursorUsed
          ? img1.width * scale
          : (img1.width / 2) * scale,

        //La hauteur de l'image dessinée dans le contexte de la balise canvas. Cela permet d'ajuster la taille de l'image. Si cet argument n'est pas spécifié, l'image prendra sa hauteur normale.
        img1.height * scale,
      )

      mainContext.translate(
        (panOffset.x / 10000) * scale - scaleOffsetX,
        (panOffset.y / 10000) * scale - scaleOffsetY,
      )

      mainContext.scale(scale, scale)

      //Draw black line
      mainContext.beginPath() // Start a new path
      mainContext.lineWidth = 3
      mainContext.moveTo(linePosition, 0) // Move the pen to (line position, 0)
      mainContext.lineTo(linePosition, mainCanvas.height) // Draw a line to (linePosition, cavans height)
      mainContext.stroke()
      // Render the path
      // place it over previous pictures

      //Draw black circle
      mainContext.beginPath()
      mainContext.arc(linePosition, HALF_PICTURE_WIDTH, 10, 0, 2 * Math.PI)
      isDraggable
        ? (mainCanvas.style.cursor = "ew-resize")
        : (mainCanvas.style.cursor = "default")
      mainContext.stroke()
      mainContext.globalCompositeOperation = "source-over" // each drawing on top of the previous one
      // place it over previous pictures

      //Draw before badge
      mainContext.beginPath()
      mainContext.roundRect(
        25 + scaleOffsetX / scale,
        25 + scaleOffsetY / scale,
        120,
        40,
        [50, 50, 50, 50],
      )
      mainContext.lineWidth = 1
      mainContext.fillStyle = "rgba(112, 111, 112, 0.54)"
      mainContext.fill()
      //Write text
      mainContext.fillStyle = "white"
      mainContext.font = "bold 14px verdana, sans-serif "
      mainContext.fillText(
        "Before",
        50 + scaleOffsetX / scale,
        50 + scaleOffsetY / scale,
      )
      mainContext.stroke()

      //Draw after badge
      mainContext.beginPath()
      mainContext.roundRect(
        770 - scaleOffsetX / scale,
        25 + scaleOffsetY / scale,
        120,
        40,
        [50, 50, 50, 50],
      )
      mainContext.lineWidth = 1
      mainContext.fillStyle = "rgba(112, 111, 112, 0.54)"
      mainContext.fill()
      //Write text
      mainContext.fillStyle = "white"
      mainContext.font = "bold 14px verdana, sans-serif "
      mainContext.fillText(
        "After",
        810 - scaleOffsetX / scale,
        50 + scaleOffsetY / scale,
      )
      mainContext.stroke()
    }
    // avoid screen clipping
    window.requestAnimationFrame(draw) //tells the browser you wish to perform an animation. It requests the browser to call a user-supplied callback function before the next repaint.
  }, [
    panOffset,
    linePosition,
    isMainCursorUsed,
    isDraggable,
    scale,
    setPanOffset,
  ])

  const handleInputValueChange = (event) => {
    setIsPanInputUsed(true)
    setPanOffset(DEFAULT_VALUES)
    setLinePosition(Math.floor((pictureSize.x / 100) * event.target.value))
  }

  const handleMouseDown = () => {
    if (!isDraggable) return
    setPanOffset(DEFAULT_VALUES)
    setIsPanInputUsed(false)
    setIsMainCursorUsed(true)
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    const mainCanvas = mainCanvasRef.current

    const { clientX, clientY } = e
    const isLineDraggable =
      clientX < linePosition + mainCanvas.offsetLeft + 10 &&
      clientX > linePosition + mainCanvas.offsetLeft - 10 &&
      clientY - mainCanvas.offsetTop >
        HALF_PICTURE_WIDTH - 10 - window.scrollY &&
      clientY - mainCanvas.offsetTop < HALF_PICTURE_WIDTH + 10 - window.scrollY
    setIsDraggable(isLineDraggable)
    isDragging && setLinePosition(clientX - mainCanvas.offsetLeft)
  }

  return (
    <>
      <canvas
        id="canvas-advanced-use"
        ref={mainCanvasRef}
        height={pictureSize.x}
        width={pictureSize.y}
        style={{ border: "2px solid white" }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
      <div>
        <input
          type="range"
          id="pan"
          name="pan"
          min="0"
          max="100"
          onChange={(e) => handleInputValueChange(e)}
          value={Math.floor((linePosition / pictureSize.y) * 100) | 0}
        />
        <label htmlFor="pan">Pan</label>
      </div>
    </>
  )
}
export default AdvancedCanvas

//https://stackoverflow.com/questions/50687334/blur-behind-transparent-box-in-javascript-canvas

//Tuto youtube : https://www.youtube.com/watch?v=6arkndScw7A&t=930s
