import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./devices/DeviceInfo"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import ListItemText from "@material-ui/core/ListItemText"
import MenuItem from "@material-ui/core/MenuItem"
import Divider from "@material-ui/core/Divider"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Menu from "@material-ui/core/Menu"
import DeleteDevice from "./devices/DeleteDevice"
import RenameDevice from "./devices/RenameDevice"
import ChangeBoard from "./devices/ChangeBoard"
import Redirect from "react-router-dom/Redirect"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
    deleteOpen: false,
    renameOpen: false,
    changeBoardOpen: false,
    goToDevices: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { device } = this.props.data

    const toggleQuietMode = muted => {
      this.props["ToggleQuietMode"]({
        variables: {
          id: device.id,
          muted,
        },
        optimisticResponse: {
          __typename: "Mutation",
          device: {
            id: device.id,
            muted,
            __typename: "Device",
          },
        },
      })
    }

    return (
      <React.Fragment>
        <div
          className="notSelectable"
          style={
            this.props.isMobile
              ? {
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  height: "64px",
                  gridArea: "header",
                  backgroundColor: "#0057cb",
                  zIndex: "1000",
                }
              : {
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  height: "64px",
                  gridArea: "mainBodyHeader",
                  backgroundColor: "#0083ff",
                  zIndex: "1000",
                }
          }
        >
          {this.props.isMobile && (
            <Tooltip
              id="tooltip-bottom"
              title="Devices list"
              placement="bottom"
            >
              <IconButton
                style={{
                  color: "white",
                  margin: "0 8px",
                }}
                onClick={() => this.setState({ goToDevices: true })}
              >
                <Icon>chevron_left</Icon>
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="h5"
            style={
              this.props.isMobile
                ? {
                    cursor: "default",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "white",
                    lineHeight: "64px",
                  }
                : {
                    cursor: "default",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "white",
                    lineHeight: "64px",
                    marginLeft: "16px",
                  }
            }
          >
            {(this.props.boardData.board &&
              this.props.boardData.board.devices.filter(
                device => device.id === this.props.deviceId
              )[0] &&
              this.props.boardData.board &&
              this.props.boardData.board.devices.filter(
                device => device.id === this.props.deviceId
              )[0].customName) ||
              (device && device.customName)}
          </Typography>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              minWidth: "96px",
            }}
          >
            <NotificationsDrawer
              completeDevice={
                (this.props.boardData.board &&
                  this.props.boardData.board.devices.filter(
                    device => device.id === this.props.deviceId
                  )[0]) ||
                device
              }
              deviceId={this.props.deviceId}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
              }
            />
            <Tooltip id="tooltip-more" title="More" placement="bottom">
              <IconButton
                onClick={this.handleMenuOpen}
                disabled={
                  !(
                    (this.props.boardData.board &&
                      this.props.boardData.board.devices.filter(
                        device => device.id === this.props.deviceId
                      )[0] &&
                      this.props.boardData.board &&
                      this.props.boardData.board.devices.filter(
                        device => device.id === this.props.deviceId
                      )[0].id) ||
                    (device && device.id)
                  )
                }
                style={{
                  color: "white",
                }}
              >
                <Icon>more_vert</Icon>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {((this.props.boardData.board &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0] &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].id &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].createdAt &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].updatedAt) ||
          (device && device.id && device.createdAt && device.updatedAt)) && (
          <DeviceInfo
            infoOpen={this.state.infoOpen}
            close={() => this.setState({ infoOpen: false })}
            device={
              device ||
              (this.props.boardData.board &&
                this.props.boardData.board.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])
            }
            devMode={this.props.devMode}
          />
        )}
        {((this.props.boardData.board &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0] &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].id &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].board &&
          this.props.boardData.board.devices.filter(
            device => device.id === this.props.deviceId
          )[0].board.id) ||
          (device && device.id && device.board && device.board.id)) && (
          <ChangeBoard
            open={this.state.changeBoardOpen}
            close={() => this.setState({ changeBoardOpen: false })}
            userData={this.props.userData}
            device={
              device ||
              (this.props.boardData.board &&
                this.props.boardData.board.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])
            }
            boards={this.props.boards}
          />
        )}
        {device && device.customName && (
          <RenameDevice
            open={this.state.renameOpen}
            close={() => this.setState({ renameOpen: false })}
            device={
              device ||
              (this.props.boardData.board &&
                this.props.boardData.board.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])
            }
          />
        )}
        <DeleteDevice
          open={this.state.deleteOpen}
          close={() => this.setState({ deleteOpen: false })}
          device={
            device ||
            (this.props.boardData.board &&
              this.props.boardData.board.devices.filter(
                device => device.id === this.props.deviceId
              )[0])
          }
        />
        {(device ||
          (this.props.boardData.board &&
            this.props.boardData.board.devices.filter(
              device => device.id === this.props.deviceId
            )[0])) && (
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.anchorEl}
            onClose={this.handleMenuClose}
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
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
            >
              <ListItemIcon>
                <Icon>info</Icon>
              </ListItemIcon>
              <ListItemText inset primary="Information" disableTypography />
            </MenuItem>
            <Divider />
            {/* <MenuItem
                    className="notSelectable"
                    style={
                      typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        place
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="See on the map" />
                  </MenuItem> */}
            {/* {navigator.share ? (
                  <MenuItem
                    className="notSelectable"
                    style={
                      typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: device.customName + " on Igloo Aurora",
                          url: window.location.href,
                        })
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        share
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Share" />
                  </MenuItem>
                ) : (
                  <CopyToClipboard text={window.location.href}>
                    <MenuItem
                      className="notSelectable"
                      style={
                        typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                      onClick={() => {
                        this.setState({ anchorEl: null })
                        this.props.openSnackBar()
                      }}
                    >
                      <ListItemIcon>
                        <Icon
                          style={
                            typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                              ? { color: "white" }
                              : { color: "black" }
                          }
                        >
                          link
                        </Icon>
                      </ListItemIcon>
                      <ListItemText inset primary="Get Link" />
                    </MenuItem>
                  </CopyToClipboard>
                        )} */}
            {(device && device.muted) ||
            ((device ||
              (this.props.boardData.board &&
                this.props.boardData.board.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])) &&
              (device ||
                (this.props.boardData.board &&
                  this.props.boardData.board.devices.filter(
                    device => device.id === this.props.deviceId
                  )[0]))) ? (
              <MenuItem
                className="notSelectable"
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
                onClick={() => {
                  toggleQuietMode(false)
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon>notifications</Icon>
                </ListItemIcon>
                <ListItemText inset primary="Unmute" disableTypography />
              </MenuItem>
            ) : (
              <MenuItem
                className="notSelectable"
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
                onClick={() => {
                  toggleQuietMode(true)
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon>notifications_off</Icon>
                </ListItemIcon>
                <ListItemText inset primary="Mute" disableTypography />
              </MenuItem>
            )}
            <Divider />
            <MenuItem
              className="notSelectable"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => {
                this.setState({ changeBoardOpen: true })
                this.handleMenuClose()
              }}
              disabled={!(this.props.boards && this.props.boards.length > 1)}
            >
              <ListItemIcon>
                <Icon>swap_horiz</Icon>
              </ListItemIcon>
              <ListItemText inset primary="Change board" disableTypography />
            </MenuItem>
            {/*
                {device.values.length > 1 && (
                  <MenuItem
                    className="notSelectable"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      this.handleOpen()
                      this.handleMenuClose()
                    }}
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        swap_vert
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Rearrange cards" />
                  </MenuItem>
                      )} */}
            <MenuItem
              className="notSelectable"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => {
                this.setState({ renameOpen: true })
                this.handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Icon>mode_edit</Icon>
              </ListItemIcon>
              <ListItemText inset primary="Rename" disableTypography />
            </MenuItem>
            <MenuItem
              className="notSelectable"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
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
          </Menu>
        )}
        {this.state.goToDevices && (
          <Redirect
            push
            to={"/dashboard?board=" + this.props.boardData.board.id}
          />
        )}
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ToggleQuietMode($id: ID!, $muted: Boolean) {
      device(id: $id, muted: $muted) {
        id
      }
    }
  `,
  {
    name: "ToggleQuietMode",
  }
)(
  graphql(
    gql`
      query($id: ID!) {
        device(id: $id) {
          id
          board {
            id
          }
          values {
            id
          }
          customName
          updatedAt
          createdAt
          muted
          firmware
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `,
    {
      options: ({ deviceId }) => ({
        variables: {
          id: deviceId,
        },
      }),
    }
  )(MainBodyHeader)
)
