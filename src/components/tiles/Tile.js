import React, { Component } from "react"
import Paper from "@material-ui/core/Paper"
import ReadOnlyBooleanTile from "./Booleans/ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./Booleans/ReadWriteBooleanTile"
import ReadOnlyFloatTile from "./Floats/ReadOnlyFloatTile"
import ReadOnlyStringTile from "./Strings/ReadOnlyStringTile"
import ReadWriteAllowedStringTile from "./Strings/ReadWriteAllowedStringTile"
import ReadWriteStringTile from "./Strings/ReadWriteStringTile"
import ReadWriteBoundedStringTile from "./Strings/ReadWriteBoundedStringTile"
import ReadWriteBoundedFloatTile from "./Floats/ReadWriteBoundedFloatTile"
import ReadWriteFloatTile from "./Floats/ReadWriteFloatTile"
import PlotTile from "./PlotTile"
import FullScreenTile from "./FullScreenTile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Divider from "@material-ui/core/Divider"
import RenameTileDialog from "./RenameTile"
import DeleteValue from "./DeleteValue"
import CardInfo from "./CardInfo.js"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import TileSize from "./TileSize"
import DataSettings from "./DataSettings"
import ToggleIcon from "material-ui-toggle-icon"

class Tile extends Component {
  state = {
    isTileFullScreen: false,
    slideIndex: 0,
    renameTileOpen: false,
    deleteTileOpen: false,
    dataVisualizationDialogOpen: false,
    infoOpen: false,
    anchorEl: null,
    tileSizeOpen: false,
    dataSettingsOpen: false,
    shareValueOpen: false,
    deleteOpen: false,
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

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { value } = this.props
    const valueTitle = value.name

    let specificTile

    if (value.__typename === "BooleanValue") {
      if (value.permission === "READ_ONLY" || value.myRole === "SPECTATOR") {
        specificTile = <ReadOnlyBooleanTile value={value.boolValue} />
      } else {
        specificTile = (
          <ReadWriteBooleanTile value={value.boolValue} id={value.id} />
        )
      }
    } else if (value.__typename === "FloatValue") {
      if (value.permission === "READ_ONLY" || value.myRole === "SPECTATOR") {
        specificTile = (
          <ReadOnlyFloatTile
            value={value.floatValue}
            unitOfMeasurement={value.unitOfMeasurement}
            nightMode={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
            }
          />
        )
      } else {
        if (value.min && value.max) {
          specificTile = (
            <ReadWriteBoundedFloatTile
              id={value.id}
              min={value.min}
              max={value.max}
              defaultValue={value.floatValue}
              step={value.precision || undefined} // avoid passing null, pass undefined instead
              disabled={value.permission === "READ_ONLY"}
            />
          )
        } else {
          specificTile = (
            <ReadWriteFloatTile
              id={value.id}
              defaultValue={value.floatValue}
              unitOfMeasurement={value.unitOfMeasurement}
              min={value.min}
              max={value.max}
            />
          )
        }
      }
    } else if (value.__typename === "StringValue") {
      if (value.permission === "READ_ONLY" || value.myRole === "SPECTATOR") {
        specificTile = (
          <ReadOnlyStringTile value={value.stringValue} id={value.id} />
        )
      } else {
        if (!value.allowedValues && !value.maxChars) {
          specificTile = (
            <ReadWriteStringTile
              value={value.stringValue}
              id={value.id}
              unitOfMeasurement={value.unitOfMeasurement}
            />
          )
        } else if (value.allowedValues) {
          specificTile = (
            <ReadWriteAllowedStringTile
              name={value.name}
              values={value.allowedValues}
              id={value.id}
              stringValue={value.stringValue}
            />
          )
        } else if (value.maxChars) {
          specificTile = (
            <ReadWriteBoundedStringTile
              name={value.name}
              id={value.id}
              stringValue={value.stringValue}
              maxChars={value.maxChars}
            />
          )
        }
      }
    } else if (
      value.__typename === "StringValue" &&
      value.permission === "READ_WRITE" &&
      !!value.maxChars
    ) {
      specificTile = (
        <ReadWriteBoundedStringTile
          name={value.name}
          id={value.id}
          stringValue={value.stringValue}
          maxChars={value.maxChars}
        />
      )
    } else if (value.__typename === "PlotValue") {
      specificTile = (
        <PlotTile value={value.plotValue} threshold={value.threshold} />
      )
    } else {
      specificTile = ""
    }

    const updateShown = visible =>
      this.props.ChangeVisiility({
        variables: {
          id: value.id,
          visibility: visible ? "VISIBLE" : "HIDDEN",
        },
        optimisticResponse: {
          __typename: "Mutation",
          value: {
            __typename: "Value",
            id: value.id,
            visibility: visible ? "VISIBLE" : "HIDDEN",
          },
        },
      })

    return (
      <React.Fragment>
        <Paper
          className={value.tileSize.toLowerCase()}
          zDepth={2}
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? { background: "#2f333d" }
              : { background: "white" }
          }
        >
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    background: "#21252b",
                    display: "flex",
                    alignItems: "center",
                    height: "64px",
                  }
                : {
                    background: "#f2f2f2",
                    display: "flex",
                    alignItems: "center",
                    height: "64px",
                  }
            }
          >
            <Typography
              variant="h6"
              className="notSelectable"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      cursor: "default",
                      color: "white",
                      marginLeft: "16px",
                      width: "calc(100% - 80px)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }
                  : {
                      cursor: "default",
                      color: "black",
                      marginLeft: "16px",
                      width: "calc(100% - 80px)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }
              }
            >
              {valueTitle}
            </Typography>
            <div
              className="notSelectable"
              style={
                value.__typename === "PlotValue"
                  ? {
                      padding: "0",
                      marginLeft: "auto",
                      marginRight: "8px",
                      float: "right",
                      minWidth: "96px",
                    }
                  : {
                      padding: "0",
                      marginLeft: "auto",
                      marginRight: "8px",
                      float: "right",
                    }
              }
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
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "white",
                          }
                        : {
                            color: "black",
                          }
                    }
                  >
                    <Icon>fullscreen</Icon>
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip id="tooltip-more" title="More" placement="bottom">
                <IconButton
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          color: "white",
                        }
                      : {
                          color: "black",
                        }
                  }
                  onClick={event =>
                    this.setState({ anchorEl: event.currentTarget })
                  }
                >
                  <Icon>more_vert</Icon>
                </IconButton>
              </Tooltip>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={this.state.anchorEl}
                onClose={() => this.setState({ anchorEl: null })}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    this.setState({ infoOpen: true })
                    this.handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Icon>info</Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Information" disableTypography />
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    value.visibility === "VISIBLE"
                      ? updateShown(false)
                      : updateShown(true)
                    this.handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Icon>
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showPassword ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showPassword || false}
                          onIcon={<Icon>visibility_off</Icon>}
                          offIcon={<Icon>visibility</Icon>}
                        />
                      )}
                    </Icon>
                  </ListItemIcon>
                  <ListItemText
                    inset
                    primary={value.visibility === "VISIBLE" ? "Hide" : "Show"}
                    disableTypography
                  />
                </MenuItem>
                <MenuItem
                  primaryText="Resize"
                  onClick={() => {
                    this.setState({ tileSizeOpen: true })
                    this.handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Icon>aspect_ratio</Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Resize" disableTypography />
                </MenuItem>
                <MenuItem
                  primaryText="Data settings"
                  onClick={() => {
                    this.handleMenuClose()
                    this.setState({ dataSettingsOpen: true })
                  }}
                >
                  <ListItemIcon>
                    <Icon>settings</Icon>
                  </ListItemIcon>
                  <ListItemText
                    inset
                    primary="Data settings"
                    disableTypography
                  />
                </MenuItem>
                <Divider />
                <MenuItem
                  primaryText="Rename"
                  onClick={() => {
                    this.setState({ renameTileOpen: true })
                    this.handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Icon>create</Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Rename" disableTypography />
                </MenuItem>
                {typeof Storage !== "undefined" &&
                  localStorage.getItem("devMode") === "true" && (
                    <MenuItem
                      onClick={() => {
                        this.setState({ deleteOpen: true })
                        this.handleMenuClose()
                      }}
                    >
                      <ListItemIcon>
                        <Icon style={{ color: "#f44336" }}>delete</Icon>
                      </ListItemIcon>
                      <ListItemText inset>
                        <span style={{ color: "#f44336" }}>Delete</span>
                      </ListItemText>
                    </MenuItem>
                  )}
              </Menu>
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
        <CardInfo
          infoOpen={this.state.infoOpen}
          handleInfoClose={() => this.setState({ infoOpen: false })}
          createdAt={value.createdAt}
          updatedAt={value.updatedAt}
          id={value.id}
          devMode={this.props.devMode}
        />
        <TileSize
          open={this.state.tileSizeOpen}
          close={() => this.setState({ tileSizeOpen: false })}
          value={value}
        />
        <DataSettings
          open={this.state.dataSettingsOpen}
          close={() => this.setState({ dataSettingsOpen: false })}
        />
        <DeleteValue
          open={this.state.deleteOpen}
          id={value.id}
          name={value.name}
          close={() => this.setState({ deleteOpen: false })}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeVisiility($id: ID!, $visibility: ValueVisibility) {
      value(id: $id, visibility: $visibility) {
        id
        visibility
      }
    }
  `,
  {
    name: "ChangeVisiility",
  }
)(Tile)
