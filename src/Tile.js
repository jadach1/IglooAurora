import React, { Component } from "react";
import Paper from "material-ui/Paper";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import ReadOnlyBooleanTile from "./tiles/ReadOnlyBooleanTile";

class Tile extends Component {
  render() {
    const valueTitle = this.props.title;
    const valueHidden = this.props.hidden;
    const value = this.props.value;
    return (
      <Paper className={this.props.className || ""} zDepth={2}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text={valueTitle} />
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            {valueHidden ? (
              <IconButton iconClassName="fas fa-eye" tooltip="Show" />
            ) : (
              <IconButton iconClassName="fas fa-eye-slash" tooltip="Hide" />
            )}

            <IconButton
              iconClassName="fas fa-expand-arrows-alt"
              tooltip="Expand"
            />
          </ToolbarGroup>
        </Toolbar>
        <ReadOnlyBooleanTile value={value} />
      </Paper>
    );
  }
}

export default Tile;
