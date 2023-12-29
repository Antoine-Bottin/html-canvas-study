import DisplayPictureCanvas from "../../components/canvas/DisplayPIctureCanvas"
import DrawOnPictureCanvas from "../../components/canvas/DrawOnPicture"
import ExportFileCanvas from "../../components/canvas/ExportFileCanvas"
import FiltersCanvas from "../../components/canvas/FiltersCanvas"
import ZoomCanvas from "../../components/canvas/ZoomCanvas"

const Page = () => {
  return (
    <>
      <h1>Basic use</h1>
      <div style={{ display: "flex", columnGap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Display picture + line</h3>
          <DisplayPictureCanvas
            width={400}
            height={400}
            src="/assets/patchwork-enhanced.png"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Zoom and Span</h3>
          <ZoomCanvas
            width={400}
            height={400}
            src="/assets/patchwork-enhanced.png"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Export file</h3>
          <ExportFileCanvas
            width={400}
            height={400}
            src="/assets/patchwork-enhanced.png"
          />
        </div>
      </div>
      <div style={{ display: "flex", columnGap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Filters</h3>
          <FiltersCanvas
            width={400}
            height={400}
            src="/assets/patchwork-enhanced.png"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Draw on picture</h3>
          <DrawOnPictureCanvas
            width={400}
            height={400}
            src="/assets/patchwork-enhanced.png"
          />
        </div>
      </div>
    </>
  )
}

export default Page
