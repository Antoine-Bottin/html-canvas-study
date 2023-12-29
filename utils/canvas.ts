const createImage = (context, src, canvas) => {
  let width = canvas.width
  let height = canvas.height
  let x = 0
  let y = 0

  const image = new Image()
  image.src = src

  image.onload = () => {
    context.drawImage(image, x, y, width, height)
  }
}
export default createImage
