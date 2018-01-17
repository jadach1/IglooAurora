import React, { Component } from "react"
import Paper from "material-ui/Paper"
import IconButton from "material-ui/IconButton"
import ReadOnlyBooleanTile from "./ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./ReadWriteBooleanTile"
import BoundedFloatTile from "./BoundedFloatTile"
import ReadOnlyColourTile from "./ReadOnlyColourTile"
import ReadWriteColourTile from "./ReadWriteColourTile"
import ReadOnlyFloatTile from "./ReadOnlyFloatTile"
import FullScreenTile from "./FullScreenTile"

class Tile extends Component {
  state = {
    isTileFullScreen: false,
  }

  render() {
    const { value } = this.props
    const valueTitle = value.customName
    const valueHidden = value.relevance === "HIDDEN"

    let specificTile
    if (
      value.__typename === "BooleanValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyBooleanTile value={value.boolValue} />
    } else if (
      value.__typename === "BooleanValue" &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteBooleanTile value={value.boolValue} id={value.id} />
      )
    } else if (value.__typename === "FloatValue" && value.boundaries) {
      specificTile = (
        <BoundedFloatTile
          id={value.id}
          min={value.boundaries[0]}
          max={value.boundaries[1]}
          defaultValue={value.floatValue}
          step={value.precision || undefined} // avoid passing null, pass undefined instead
          disabled={value.permission === "READ_ONLY"}
        />
      )
    } else if (
      value.__typename === "FloatValue" &&
      !value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyFloatTile value={value.floatValue} />
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyColourTile colour={value.colourValue} />
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteColourTile value={value.colourValue} id={value.id} />
      )
    } else {
      specificTile = ""
    }

    return (
      <Paper className={value.tileSize.toLowerCase()} zDepth={2}>
        <FullScreenTile
          fullScreen={this.state.isTileFullScreen}
          handleClose={() => {
            this.setState({ isTileFullScreen: false })
          }}
          value={value}
          specificTile={specificTile}
        />
        <div className="tileHeader">
          <div className="tileTitle" title={valueTitle}>
            {valueTitle}
          </div>
          <div className="tileHeaderButtons">
            {valueHidden ? (
              <IconButton tooltip="Show">
                <i class="material-icons">visibility</i>
              </IconButton>
            ) : (
              <IconButton tooltip="Hide">
                <i class="material-icons">visibility_off</i>
              </IconButton>
            )}

            <IconButton
              tooltip="Expand"
              onClick={() => {
                this.setState({ isTileFullScreen: true })
              }}
            >
              <i class="material-icons">fullscreen</i>
            </IconButton>
          </div>
        </div>
        {specificTile}
      </Paper>
    )
  }
}

export default Tile
