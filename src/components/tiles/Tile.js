import React, { Component } from "react"
import Paper from "material-ui/Paper"
import IconButton from "material-ui-next/IconButton"
import ReadOnlyBooleanTile from "./Booleans/ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./Booleans/ReadWriteBooleanTile"
import ReadWriteBoundedFloatTile from "./Floats/ReadWriteBoundedFloatTile"
import ReadOnlyBoundedFloatTile from "./Floats/ReadOnlyBoundedFloatTile"
import ReadOnlyColourTile from "./Colors/ReadOnlyColourTile"
import ReadWriteColourTile from "./Colors/ReadWriteColourTile"
import ReadOnlyFloatTile from "./Floats/ReadOnlyFloatTile"
import ReadOnlyStringTile from "./Strings/ReadOnlyStringTile"
import ReadWriteAllowedStringTile from "./Strings/ReadWriteAllowedStringTile"
import ReadWriteStringTile from "./Strings/ReadWriteStringTile"
import ReadWriteBoundedStringTile from "./Strings/ReadWriteBoundedStringTile"
import PlotTile from "./PlotTile.js"
import FullScreenTile from "./FullScreenTile"
import MenuItem from "material-ui/MenuItem"
import IconMenu from "material-ui/IconMenu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ArrowDropRight from "material-ui/svg-icons/navigation-arrow-drop-right"
import { PopoverAnimationVertical } from "material-ui/Popover"
import Divider from "material-ui/Divider"
import RenameTileDialog from "./RenameTile"
import DeleteTileDialog from "./DeleteTile"
import Tooltip from "material-ui-next/Tooltip"
import Icon from "material-ui-next/Icon"
import InfoDialog from "./InfoDialog.js"

class Tile extends Component {
  state = {
    isTileFullScreen: false,
    slideIndex: 0,
    renameTileOpen: false,
    deleteTileOpen: false,
    dataVisualizationDialogOpen: false,
    infoOpen: false,
    tileMenuOpen: false,
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
    } else if (
      value.__typename === "FloatValue" &&
      !value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyFloatTile
          value={value.floatValue}
          valueDetails={value.valueDetails}
          nightMode={this.props.nightMode}
        />
      )
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
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyStringTile value={value.stringValue} id={value.id} />
      )
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
    } else if (value.__typename === "PlotValue") {
      specificTile = <PlotTile value={value.plotValue} />
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
              : value.__typename === "PlotValue"
                ? "ChangePlotSize"
                : value.__typename === "StringPlotValue"
                  ? "ChangeStringPlotSize"
                  : value.__typename === "MapValue"
                    ? "ChangeMapSize"
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
                : value.__typename === "PlotValue"
                  ? "plotValue"
                  : value.__typename === "StringPlotValue"
                    ? "stringPlotValue"
                    : value.__typename === "MapValue"
                      ? "mapValue"
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
              : value.__typename === "PlotValue"
                ? "ChangePlotSize"
                : value.__typename === "StringPlotValue"
                  ? "ChangeStringPlotSize"
                  : value.__typename === "MapValue"
                    ? "ChangeMapSize"
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
                : value.__typename === "PlotValue"
                  ? "plotValue"
                  : value.__typename === "StringPlotValue"
                    ? "stringPlotValue"
                    : value.__typename === "MapValue"
                      ? "mapValue"
                      : "booleanValue"]: {
            __typename: value.__typename,
            id: value.id,
            relevance: visible ? "VISIBLE" : "HIDDEN",
          },
        },
      })

    return (
      <React.Fragment>
        <Paper
          className={value.tileSize.toLowerCase()}
          zDepth={2}
          style={
            this.props.nightMode
              ? { background: "#2f333d" }
              : { background: "white" }
          }
        >
          <div
            style={
              this.props.nightMode
                ? {
                    background: "#21252b",
                    display: "flex",
                    alignItems: "center",
                  }
                : {
                    background: "#f2f2f2",
                    display: "flex",
                    alignItems: "center",
                  }
            }
          >
            <div
              className="tileTitle"
              style={
                this.props.nightMode
                  ? {
                      cursor: "default",
                      color: "white",
                      marginLeft: "16px",
                    }
                  : {
                      cursor: "default",
                      color: "black",
                      marginLeft: "16px",
                    }
              }
            >
              {valueTitle}
            </div>
            <div
              className="notSelectable"
              style={{
                padding: "0",
                marginLeft: "auto",
                marginRight: "8px",
                float: "right",
              }}
            >
              {value.__typename === "PlotValue" ? (
                <Tooltip
                  id="tooltip-fullscreen"
                  title="Fullscreen"
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => {
                      this.setState({ isTileFullScreen: true })
                    }}
                    style={
                      this.props.nightMode
                        ? {
                            padding: "0",
                            color: "white",
                          }
                        : {
                            padding: "0",
                            color: "black",
                          }
                    }
                  >
                    <Icon>fullscreen</Icon>
                  </IconButton>
                </Tooltip>
              ) : null}
              <IconMenu
                iconButtonElement={
                  <Tooltip id="tooltip-more" title="More" placement="bottom">
                    <IconButton
                      style={
                        this.props.nightMode
                          ? {
                              padding: "0",
                              color: "white",
                            }
                          : {
                              padding: "0",
                              color: "black",
                            }
                      }
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </Tooltip>
                }
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                targetOrigin={{ horizontal: "right", vertical: "top" }}
                onClick={() => this.setState({ tileMenuOpen: true })}
                onRequestChange={() =>
                  this.state.tileMenuOpen
                    ? this.setState({ tileMenuOpen: false })
                    : null
                }
                open={this.state.tileMenuOpen}
                className="notSelectable"
                menuStyle={
                  this.props.nightMode
                    ? { background: "#2f333d" }
                    : { background: "white" }
                }
              >
                {/* <MenuItem
                  primaryText="See on the map"
                  className="notSelectable"
                  leftIcon={<Icon>place</Icon>}
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                />
                <Divider
                  style={this.props.nightMode ? { background: "#21252b" } : {}}
                /> */}
                <MenuItem
                  primaryText="Information"
                  className="notSelectable"
                  onClick={() => this.setState({ infoOpen: true })}
                  leftIcon={<Icon>info</Icon>}
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                />
                <Divider
                  style={this.props.nightMode ? { background: "#21252b" } : {}}
                />
                <MenuItem
                  primaryText={value.relevance === "VISIBLE" ? "Hide" : "Show"}
                  className="notSelectable"
                  leftIcon={
                    value.relevance === "VISIBLE" ? (
                      <Icon>visibility_off</Icon>
                    ) : (
                      <Icon>visibility</Icon>
                    )
                  }
                  onClick={
                    value.relevance === "VISIBLE"
                      ? updateShown(false)
                      : updateShown(true)
                  }
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                />
                <MenuItem
                  primaryText="Resize"
                  rightIcon={<ArrowDropRight />}
                  className="notSelectable"
                  animation={PopoverAnimationVertical}
                  leftIcon={<Icon>aspect_ratio</Icon>}
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                  menuItems={[
                    <MenuItem
                      primaryText="Small"
                      onClick={updateTileMutation("NORMAL")}
                      className="notSelectable"
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    />,
                    <MenuItem
                      primaryText="Wide"
                      onClick={updateTileMutation("WIDE")}
                      className="notSelectable"
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    />,
                    <MenuItem
                      primaryText="Tall"
                      onClick={updateTileMutation("TALL")}
                      className="notSelectable"
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    />,
                    <MenuItem
                      primaryText="Large"
                      onClick={updateTileMutation("LARGE")}
                      className="notSelectable"
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    />,
                  ]}
                />
                {value.__typename === "FloatValue" ||
                value.__typename === "ColourValue" ? (
                  <MenuItem
                    primaryText="Data"
                    leftIcon={<Icon>timeline</Icon>}
                    className="notSelectable"
                    rightIcon={<ArrowDropRight />}
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    menuItems={[
                      ...(value.__typename === "FloatValue" &&
                      value.boundaries &&
                      value.boundaries.length !== 0
                        ? [
                            <MenuItem
                              primaryText="Visualization"
                              rightIcon={<ArrowDropRight />}
                              className="notSelectable"
                              menuItems={[
                                value.permission === "READ_ONLY" ? (
                                  <MenuItem
                                    primaryText="Gauge"
                                    className="notSelectable"
                                    style={
                                      this.props.nightMode
                                        ? { color: "white" }
                                        : { color: "black" }
                                    }
                                  />
                                ) : (
                                  <MenuItem
                                    primaryText="Slider"
                                    className="notSelectable"
                                    style={
                                      this.props.nightMode
                                        ? { color: "white" }
                                        : { color: "black" }
                                    }
                                  />
                                ),
                                value.permission === "READ_ONLY" ? (
                                  <MenuItem
                                    primaryText="Number"
                                    className="notSelectable"
                                    style={
                                      this.props.nightMode
                                        ? { color: "white" }
                                        : { color: "black" }
                                    }
                                  />
                                ) : (
                                  <MenuItem
                                    primaryText="Input"
                                    className="notSelectable"
                                    style={
                                      this.props.nightMode
                                        ? { color: "white" }
                                        : { color: "black" }
                                    }
                                  />
                                ),
                              ]}
                            />,
                          ]
                        : []),
                      ...(value.__typename === "ColourValue"
                        ? [
                            <MenuItem
                              primaryText="Visualization"
                              className="notSelectable"
                              rightIcon={<ArrowDropRight />}
                              style={
                                this.props.nightMode
                                  ? { color: "white" }
                                  : { color: "black" }
                              }
                              menuItems={[
                                <MenuItem
                                  primaryText="Normal"
                                  className="notSelectable"
                                  style={
                                    this.props.nightMode
                                      ? { color: "white" }
                                      : { color: "black" }
                                  }
                                />,
                                <MenuItem
                                  primaryText="Advanced"
                                  className="notSelectable"
                                  style={
                                    this.props.nightMode
                                      ? { color: "white" }
                                      : { color: "black" }
                                  }
                                />,
                              ]}
                            />,
                          ]
                        : []),
                      ...(value.__typename === "FloatValue"
                        ? [
                            <MenuItem
                              primaryText="Unit of measurement"
                              className="notSelectable"
                              rightIcon={<ArrowDropRight />}
                              style={
                                this.props.nightMode
                                  ? { color: "white" }
                                  : { color: "black" }
                              }
                              menuItems={[
                                <MenuItem
                                  primaryText="Lorem Ipsum A"
                                  className="notSelectable"
                                  style={
                                    this.props.nightMode
                                      ? { color: "white" }
                                      : { color: "black" }
                                  }
                                />,
                                <MenuItem
                                  primaryText="Lorem Ipsum B"
                                  className="notSelectable"
                                  style={
                                    this.props.nightMode
                                      ? { color: "white" }
                                      : { color: "black" }
                                  }
                                />,
                              ]}
                            />,
                          ]
                        : []),
                    ]}
                  />
                ) : (
                  ""
                )}
                <Divider
                  style={this.props.nightMode ? { background: "#21252b" } : {}}
                />
                <MenuItem
                  primaryText="Rename"
                  className="notSelectable"
                  leftIcon={<Icon>create</Icon>}
                  onClick={() => this.setState({ renameTileOpen: true })}
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                />
                <MenuItem
                  primaryText="Delete"
                  className="notSelectable"
                  leftIcon={<Icon>delete</Icon>}
                  innerDivStyle={{ color: "#f44336" }}
                  onClick={this.deleteClick}
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                />
              </IconMenu>
            </div>
          </div>
          {specificTile}
        </Paper>
        <FullScreenTile
          fullScreen={this.state.isTileFullScreen}
          handleClose={() => {
            this.setState({ isTileFullScreen: false })
          }}
          value={value}
          specificTile={specificTile}
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
        <InfoDialog
          infoOpen={this.state.infoOpen}
          handleInfoClose={() => this.setState({ infoOpen: false })}
          createdAt={value.createdAt}
          updatedAt={value.updatedAt}
          id={value.id}
          devMode={this.props.devMode}
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
      )(
        graphql(
          gql`
            mutation ChangeSize(
              $id: ID!
              $size: TileSize
              $relevance: ValueRelevance
            ) {
              plotValue(tileSize: $size, id: $id, relevance: $relevance) {
                id
                relevance
                tileSize
              }
            }
          `,
          {
            name: "ChangePlotSize",
          }
        )(
          graphql(
            gql`
              mutation ChangeSize(
                $id: ID!
                $size: TileSize
                $relevance: ValueRelevance
              ) {
                mapValue(tileSize: $size, id: $id, relevance: $relevance) {
                  id
                  relevance
                  tileSize
                }
              }
            `,
            {
              name: "ChangeMapSize",
            }
          )(
            graphql(
              gql`
                mutation ChangeSize(
                  $id: ID!
                  $size: TileSize
                  $relevance: ValueRelevance
                ) {
                  stringPlotValue(
                    tileSize: $size
                    id: $id
                    relevance: $relevance
                  ) {
                    id
                    relevance
                    tileSize
                  }
                }
              `,
              {
                name: "ChangeStringPlotSize",
              }
            )(Tile)
          )
        )
      )
    )
  )
)
