import React, { Component } from "react"
import Paper from "material-ui/Paper"
import IconButton from "material-ui/IconButton"
import ReadOnlyBooleanTile from "./ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./ReadWriteBooleanTile"
import ReadWriteBoundedFloatTile from "./ReadWriteBoundedFloatTile"
import ReadOnlyBoundedFloatTile from "./ReadOnlyBoundedFloatTile"
import ReadOnlyColourTile from "./ReadOnlyColourTile"
import ReadWriteColourTile from "./ReadWriteColourTile"
import ReadOnlyFloatTile from "./ReadOnlyFloatTile"
import ReadOnlyStringTile from "./ReadOnlyStringTile"
import ReadWriteAllowedStringTile from "./ReadWriteAllowedStringTile"
import ReadWriteStringTile from "./ReadWriteStringTile"
import ReadWriteBoundedStringTile from "./ReadWriteBoundedStringTile"
import FullScreenTile from "./FullScreenTile"
import MenuItem from "material-ui/MenuItem"
import IconMenu from "material-ui/IconMenu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ArrowDropRight from "material-ui/svg-icons/navigation-arrow-drop-right"
import { List, ListItem } from "material-ui/List"
import Toggle from "material-ui/Toggle"
import Subheader from "material-ui/Subheader"
import DropDownMenu from "material-ui/DropDownMenu"
import TileSettings from "./TileSettings"
import { PopoverAnimationVertical } from "material-ui/Popover"
import Divider from "material-ui/Divider"
import RenameTileDialog from "./RenameTile"
import DeleteTileDialog from "./DeleteTile"
import DataVisualizationSettings from "./DataVisualizationSettings"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Tooltip from "material-ui-next/Tooltip"

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

class Tile extends Component {
  state = {
    isTileFullScreen: false,
    open: false,
    slideIndex: 0,
    renameTileOpen: false,
    deleteTileOpen: false,
    dataVisualizationDialogOpen: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleClick = event => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  handleRenameTileDialogClose = () => {
    this.setState({ renameTileOpen: false })
  }

  handleDeleteTileDialogClose = () => {
    this.setState({ deleteTileOpen: false })
  }

  deleteClick = () => {
    this.setState({ deleteTileOpen: true })
  }

  dataVisualizationDialogOpen = () => {
    this.setState({ dataVisualizationDialogOpen: true })
  }

  dataVisualizationDialogClose = () => {
    this.setState({ dataVisualizationDialogOpen: false })
  }

  render() {
    const { value } = this.props
    const valueTitle = value.customName

    let specificTile
    let specificInterfaceSettings
    let specificVisualizationSettings
    let specificDataSettings

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
    } else if (
      value.__typename === "FloatValue" &&
      value.boundaries &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteBoundedFloatTile
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
      value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyBoundedFloatTile
          id={value.id}
          min={value.boundaries[0]}
          max={value.boundaries[1]}
          defaultValue={value.floatValue}
          step={value.precision || undefined} // avoid passing null, pass undefined instead
        />
      )
      specificInterfaceSettings = (
        <React.Fragment>
          <div style={listStyles.root}>
            <List style={{ width: "100%" }}>
              <Subheader>Visualization</Subheader>
              <ListItem
                primaryText="Choose how the data is visualized"
                secondaryText="Number"
              />
            </List>
          </div>
        </React.Fragment>
      )
      specificVisualizationSettings = (
        <RadioButtonGroup name="Data visualization">
          <RadioButton
            value="number"
            label="Number"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
          <RadioButton
            value="graph"
            label="Graph"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
          <RadioButton
            value="gauge"
            label="Gauge"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
        </RadioButtonGroup>
      )
    } else if (
      value.__typename === "FloatValue" &&
      !value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyFloatTile
          value={value.floatValue}
          valueDetails={value.valueDetails}
        />
      )
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Choose how the data is visualized"
              secondaryText="Number"
              onClick={this.dataVisualizationDialogOpen}
            />
          </List>
        </div>
      )
      specificVisualizationSettings = (
        <RadioButtonGroup name="Data visualization">
          <RadioButton
            value="number"
            label="Number"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
          <RadioButton
            value="graph"
            label="Graph"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
        </RadioButtonGroup>
      )
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyColourTile colour={value.colourValue} />
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Show advanced options for the color picker"
              secondaryText="Show RGB, HEX and HSL color codes"
              rightToggle={
                <Toggle
                  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                  rippleStyle={{ color: "#0083ff" }}
                />
              }
            />
          </List>
        </div>
      )
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteColourTile value={value.colourValue} id={value.id} />
      )
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Show advanced options for the color picker"
              secondaryText="Show RGB, HEX and HSL color codes"
              rightToggle={
                <Toggle
                  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                  rippleStyle={{ color: "#0083ff" }}
                />
              }
            />
          </List>
        </div>
      )
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyStringTile value={value.stringValue} id={value.id} />
      )
      specificInterfaceSettings = ""
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_WRITE" &&
      !!value.allowedValues
    ) {
      specificTile = (
        <ReadWriteAllowedStringTile
          customName={value.customName}
          values={value.allowedValues}
          id={value.id}
          stringValue={value.stringValue}
        />
      )
      specificInterfaceSettings = ""
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_WRITE" &&
      !value.allowedValues &&
      !value.maxChars
    ) {
      specificTile = (
        <ReadWriteStringTile
          customName={value.customName}
          values={value.allowedValues}
          id={value.id}
          stringValue={value.stringValue}
        />
      )
      specificInterfaceSettings = ""
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_WRITE" &&
      value.maxChars
    ) {
      specificTile = (
        <ReadWriteBoundedStringTile
          customName={value.customName}
          values={value.allowedValues}
          id={value.id}
          stringValue={value.stringValue}
          maxChars={value.maxChars}
        />
      )
      specificInterfaceSettings = ""
    } else {
      specificTile = ""
    }

    const updateTileMutation = size => () =>
      this.props[
        value.__typename === "FloatValue"
          ? "ChangeFloatSize"
          : value.__typename === "StringValue"
            ? "ChangeStringSize"
            : value.__typename === "ColourValue"
              ? "ChangeColourSize"
              : "ChangeBooleanSize"
      ]({
        variables: {
          id: value.id,
          size,
        },
        optimisticResponse: {
          __typename: "Mutation",
          [value.__typename === "FloatValue"
            ? "floatValue"
            : value.__typename === "StringValue"
              ? "stringValue"
              : value.__typename === "ColourValue"
                ? "colourValue"
                : "booleanValue"]: {
            __typename: value.__typename,
            id: value.id,
            tileSize: size,
          },
        },
      })

    const updateShown = visible => () =>
      this.props[
        value.__typename === "FloatValue"
          ? "ChangeFloatSize"
          : value.__typename === "StringValue"
            ? "ChangeStringSize"
            : value.__typename === "ColourValue"
              ? "ChangeColourSize"
              : "ChangeBooleanSize"
      ]({
        variables: {
          id: value.id,
          relevance: visible ? "VISIBLE" : "HIDDEN",
        },
        optimisticResponse: {
          __typename: "Mutation",
          [value.__typename === "FloatValue"
            ? "floatValue"
            : value.__typename === "StringValue"
              ? "stringValue"
              : value.__typename === "ColourValue"
                ? "colourValue"
                : "booleanValue"]: {
            __typename: value.__typename,
            id: value.id,
            relevance: visible ? "VISIBLE" : "HIDDEN",
          },
        },
      })

    return (
      <React.Fragment>
        <Paper className={value.tileSize.toLowerCase()} zDepth={2}>
          <div className="tileHeader">
            <div className="tileTitle">{valueTitle}</div>
            <div className="tileHeaderButtons notSelectable">
              <IconButton
                onClick={() => {
                  this.setState({ isTileFullScreen: true })
                }}
                style={{
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  marginTop: "14px",
                  marginBottom: "14px",
                }}
              >
                <Tooltip
                  id="tooltip-bottom"
                  title="Fullscreen"
                  placement="bottom"
                >
                  <i className="material-icons">fullscreen</i>
                </Tooltip>
              </IconButton>
              <IconMenu
                iconButtonElement={
                  <IconButton
                    style={{
                      padding: "0",
                      width: "32px",
                      height: "32px",
                    }}
                  >
                    <Tooltip
                      id="tooltip-bottom"
                      title="More"
                      placement="bottom"
                    >
                      <i className="material-icons">more_vert</i>
                    </Tooltip>
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                targetOrigin={{ horizontal: "right", vertical: "top" }}
                animation={PopoverAnimationVertical}
                desktop={true}
              >
                <MenuItem
                  primaryText={value.relevance === "VISIBLE" ? "Hide" : "Show"}
                  leftIcon={
                    value.relevance === "VISIBLE" ? (
                      <i class="material-icons">visibility_off</i>
                    ) : (
                      <i class="material-icons">visibility</i>
                    )
                  }
                  onClick={
                    value.relevance === "VISIBLE"
                      ? updateShown(false)
                      : updateShown(true)
                  }
                />
                <MenuItem
                  primaryText="Resize"
                  rightIcon={<ArrowDropRight />}
                  animation={PopoverAnimationVertical}
                  leftIcon={<i class="material-icons">aspect_ratio</i>}
                  menuItems={[
                    <MenuItem
                      primaryText="Small"
                      onClick={updateTileMutation("NORMAL")}
                    />,
                    <MenuItem
                      primaryText="Wide"
                      onClick={updateTileMutation("WIDE")}
                    />,
                    <MenuItem
                      primaryText="Tall"
                      onClick={updateTileMutation("TALL")}
                    />,
                    <MenuItem
                      primaryText="Large"
                      onClick={updateTileMutation("LARGE")}
                    />,
                  ]}
                />
                <MenuItem
                  primaryText="Settings"
                  onClick={this.handleOpen}
                  leftIcon={<i class="material-icons">settings</i>}
                />
                <Divider />
                <MenuItem
                  primaryText="Rename"
                  leftIcon={<i class="material-icons">create</i>}
                  onClick={() => this.setState({ renameTileOpen: true })}
                />
                <MenuItem
                  primaryText="Delete"
                  leftIcon={<i class="material-icons">delete</i>}
                  innerDivStyle={{ color: "#f44336" }}
                  onClick={this.deleteClick}
                />
              </IconMenu>
            </div>
          </div>
          {specificTile}
        </Paper>
        <TileSettings
          interface={specificInterfaceSettings}
          data={specificDataSettings}
          isOpen={this.state.open}
          handleClose={this.handleClose}
        />
        <FullScreenTile
          fullScreen={this.state.isTileFullScreen}
          handleClose={() => {
            this.setState({ isTileFullScreen: false })
          }}
          value={value}
          specificTile={specificTile}
        />
        <DataVisualizationSettings
          dataVisualizationDialogOpen={this.state.dataVisualizationDialogOpen}
          dataVisualizationDialogClose={this.dataVisualizationDialogClose}
          specificVisualizationSettings={specificVisualizationSettings}
        />
        <RenameTileDialog
          renameTileOpen={this.state.renameTileOpen}
          handleRenameTileDialogClose={this.handleRenameTileDialogClose}
          tileName={valueTitle}
          value={value}
        />
        <DeleteTileDialog
          deleteTileOpen={this.state.deleteTileOpen}
          handleDeleteTileDialogClose={this.handleDeleteTileDialogClose}
          tileName={valueTitle}
          deleteTile={this.deleteTile}
          value={value}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeSize($id: ID!, $size: TileSize, $relevance: ValueRelevance) {
      floatValue(tileSize: $size, id: $id, relevance: $relevance) {
        id
        relevance
        tileSize
      }
    }
  `,
  {
    name: "ChangeFloatSize",
  }
)(
  graphql(
    gql`
      mutation ChangeSize(
        $id: ID!
        $size: TileSize
        $relevance: ValueRelevance
      ) {
        stringValue(tileSize: $size, id: $id, relevance: $relevance) {
          id
          tileSize
          relevance
        }
      }
    `,
    {
      name: "ChangeStringSize",
    }
  )(
    graphql(
      gql`
        mutation ChangeSize(
          $id: ID!
          $size: TileSize
          $relevance: ValueRelevance
        ) {
          booleanValue(tileSize: $size, id: $id, relevance: $relevance) {
            id
            relevance
            tileSize
          }
        }
      `,
      {
        name: "ChangeBooleanSize",
      }
    )(
      graphql(
        gql`
          mutation ChangeSize(
            $id: ID!
            $size: TileSize
            $relevance: ValueRelevance
          ) {
            colourValue(tileSize: $size, id: $id, relevance: $relevance) {
              id
              relevance
              tileSize
            }
          }
        `,
        {
          name: "ChangeColourSize",
        }
      )(Tile)
    )
  )
)
