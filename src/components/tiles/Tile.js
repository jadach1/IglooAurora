import React, { Component } from "react"
import Paper from "material-ui/Paper"
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import ReadOnlyBooleanTile from "./ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./ReadWriteBooleanTile"
import BoundedFloatTile from "./BoundedFloatTile"
import ReadOnlyColourTile from "./ReadOnlyColourTile"

class Tile extends Component {
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
      specificTile = <ReadWriteBooleanTile value={value.boolValue} />
    } else if (value.__typename === "FloatValue" && value.boundaries) {
      specificTile = (
        <BoundedFloatTile
          min={value.boundaries[0]}
          max={value.boundaries[1]}
          defaultValue={value.floatValue}
          step={value.precision || undefined} // avoid passing null, pass undefined instead
          disabled={value.permission === "READ_ONLY"}
        />
      )
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyColourTile colour={value.colourValue} />
    } else {
      specificTile = ""
    }

    return (
      <Paper className={value.tileSize.toLowerCase()} zDepth={2}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text={valueTitle} />
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            {valueHidden ? (
              <IconButton iconClassName="fas fa-eye" tooltip="Hide" />
            ) : (
              <IconButton iconClassName="fas fa-eye-slash" tooltip="Show" />
            )}

            <IconButton
              iconClassName="fas fa-expand-arrows-alt"
              tooltip="Expand"
            />
          </ToolbarGroup>
        </Toolbar>
        {specificTile}
      </Paper>
    )
  }
}

export default Tile
