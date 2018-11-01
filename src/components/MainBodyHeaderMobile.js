import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./devices/DeviceInfo"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import { Redirect } from "react-router-dom"
import Divider from "@material-ui/core/Divider"
import Tooltip from "@material-ui/core/Tooltip"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from "@material-ui/core/Typography"
import DeleteDevice from "./devices/DeleteDevice"
import ChangeBoard from "./devices/ChangeBoard"
import RenameDevice from "./devices/RenameDevice"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
    anchorEl: null,
    deleteOpen: false,
    changeBoardOpen: false,
    renameOpen: false,
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

    const toggleQuietMode = quietMode =>
      this.props.ToggleQuietMode({
        variables: {
          id:
            this.props.userData.user &&
            this.props.userData.user.devices.filter(
              device => device.id === this.props.deviceId
            )[0].id,
          quietMode,
        },
        optimisticResponse: {
          __typename: "Mutation",
          device: {
            id:
              this.props.userData.user &&
              this.props.userData.user.devices.filter(
                device => device.id === this.props.deviceId
              )[0].id,
            quietMode,
            __typename: "Device",
          },
        },
      })

    return (
      <React.Fragment>
        <div
          className="mobileMainBodyHeader notSelectable"
          style={{
            color: "white",
            backgroundColor: "#0057cb",
            height: "64px",
          }}
        >
          <div className="mobileBackIcon">
            <Tooltip
              id="tooltip-bottom"
              title="Devices list"
              placement="bottom"
            >
              <IconButton
                style={{
                  color: "white",
                  marginTop: "8px",
                }}
                onClick={() => this.setState({ goToDevices: true })}
              >
                <Icon>chevron_left</Icon>
              </IconButton>
            </Tooltip>
          </div>
          {this.props.userData.user &&
          this.props.userData.user.devices.filter(
            device => device.id === this.props.deviceId
          )[0].icon ? (
            <img
              className="deviceIconBig"
              src={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0].icon
              }
              alt="device logo"
            />
          ) : (
            <i
              className="deviceIconBig material-icons"
              style={{ cursor: "default" }}
            >
              lightbulb_outline
            </i>
          )}
          <Typography
            variant="headline"
            className="title"
            style={{
              cursor: "default",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "white",
              lineHeight: "64px",
            }}
          >
            {this.props.userData.user &&
              this.props.userData.user.devices.filter(
                device => device.id === this.props.deviceId
              )[0].customName}
          </Typography>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              gridArea: "buttons",
            }}
          >
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
                className="notSelectable"
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
                onClick={() => {
                  this.setState({ infoOpen: true })
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
                    info
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Device information" />
              </MenuItem>
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
              <Divider />
              {this.props.userData.user &&
              this.props.userData.user.devices.filter(
                device => device.id === this.props.deviceId
              )[0].quietMode ? (
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
                    <Icon
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      notifications
                    </Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Unmute" />
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
                    <Icon
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      notifications_off
                    </Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Mute" />
                </MenuItem>
              )}
              <Divider />
              {this.props.userData.user.boards.length > 1 && (
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
                      swap_horiz
                    </Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Change board" />
                </MenuItem>
              )}
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
                )}{" "}
                      */}
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
                  <Icon
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    mode_edit
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Rename" />
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
            <NotificationsDrawer
              device={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0]
              }
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
              }
              isMobile={this.props.isMobile}
            />
            <Tooltip id="tooltip-more" title="More" placement="bottom">
              <MuiThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: { main: "#ffffff" },
                  },
                })}
              >
                <IconButton
                  style={{ marginTop: "8px" }}
                  onClick={this.handleMenuOpen}
                  color="primary"
                >
                  <Icon>more_vert</Icon>
                </IconButton>
              </MuiThemeProvider>
            </Tooltip>
          </div>
        </div>
        {device && (
          <React.Fragment>
            <DeviceInfo
              infoOpen={this.state.infoOpen}
              close={() => this.setState({ infoOpen: false })}
              id={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0].id
              }
              firmware={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0].firmware
              }
              updatedAt={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0].updatedAt
              }
              createdAt={
                this.props.userData.user &&
                this.props.userData.user.devices.filter(
                  device => device.id === this.props.deviceId
                )[0].createdAt
              }
              devMode={this.props.devMode}
            />
            <ChangeBoard
              open={this.state.changeBoardOpen}
              close={() => this.setState({ changeBoardOpen: false })}
              userData={this.props.userData}
              device={device}
            />
            <RenameDevice
              open={this.state.renameOpen}
              close={() => this.setState({ renameOpen: false })}
              device={device}
            />
            <DeleteDevice
              open={this.state.deleteOpen}
              close={() => this.setState({ deleteOpen: false })}
              device={device}
            />
          </React.Fragment>
        )}
        {this.state.goToDevices && (
          <Redirect push to={"/dashboard?board=" + this.props.selectedBoard} />
        )}
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ToggleQuietMode($id: ID!, $quietMode: Boolean) {
      device(id: $id, quietMode: $quietMode) {
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
          icon
          updatedAt
          createdAt
          myRole
          quietMode
          firmware
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
          }
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
