import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./devices/DeviceInfo"
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
import ChangeEnvironment from "./devices/ChangeEnvironment"
import { Link, Redirect } from "react-router-dom"
import { hotkeys } from "react-keyboard-shortcuts"

class MainBodyHeader extends Component {
  hot_keys = {
    "alt+backspace": {
      priority: 1,
      handler: event => this.setState({ goToDevices: true }),
    },
  }

  state = {
    open: false,
    infoOpen: false,
    deleteOpen: false,
    renameOpen: false,
    changeEnvironmentOpen: false,
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
            <Tooltip id="tooltip-bottom" title="Devices" placement="bottom">
              <Link
                to={
                  this.props.environmentData.environment
                    ? "/?environment=" +
                      this.props.environmentData.environment.id
                    : ""
                }
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: "0 8px",
                }}
              >
                <IconButton
                  style={
                    this.props.environmentData.environment
                      ? {
                          color: "white",
                        }
                      : {
                          color: "white",
                          opacity: 0.5,
                        }
                  }
                  disabled={!this.props.environmentData.environment}
                  tabIndex="-1"
                >
                  <Icon>arrow_back</Icon>
                </IconButton>
              </Link>
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
            {(this.props.environmentData.environment &&
              this.props.environmentData.environment.devices.filter(
                device => device.id === this.props.deviceId
              )[0] &&
              this.props.environmentData.environment &&
              this.props.environmentData.environment.devices.filter(
                device => device.id === this.props.deviceId
              )[0].name) ||
              (device && device.name)}
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
                (this.props.environmentData.environment &&
                  this.props.environmentData.environment.devices.filter(
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
              logOut={this.props.logOut}
              isMobile={this.props.isMobile}
            />
            <Tooltip id="tooltip-more" title="More" placement="bottom">
              <IconButton
                onClick={this.handleMenuOpen}
                disabled={
                  !(
                    (this.props.environmentData.environment &&
                      this.props.environmentData.environment.devices.filter(
                        device => device.id === this.props.deviceId
                      )[0] &&
                      this.props.environmentData.environment &&
                      this.props.environmentData.environment.devices.filter(
                        device => device.id === this.props.deviceId
                      )[0].id) ||
                    (device && device.id)
                  )
                }
                style={
                  (this.props.environmentData.environment &&
                    this.props.environmentData.environment.devices.filter(
                      device => device.id === this.props.deviceId
                    )[0] &&
                    this.props.environmentData.environment &&
                    this.props.environmentData.environment.devices.filter(
                      device => device.id === this.props.deviceId
                    )[0].id) ||
                  (device && device.id)
                    ? {
                        color: "white",
                      }
                    : { color: "white", opacity: 0.5 }
                }
              >
                <Icon>more_vert</Icon>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {((this.props.environmentData.environment &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0] &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0].id &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0].createdAt &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0].updatedAt) ||
          (device && device.id && device.createdAt && device.updatedAt)) && (
          <DeviceInfo
            infoOpen={this.state.infoOpen}
            close={() => this.setState({ infoOpen: false })}
            device={
              device ||
              (this.props.environmentData.environment &&
                this.props.environmentData.environment.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])
            }
            devMode={this.props.devMode}
          />
        )}
        {((this.props.environmentData.environment &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0] &&
          this.props.environmentData.environment.devices.filter(
            device => device.id === this.props.deviceId
          )[0].id) ||
          (device && device.id)) &&
          this.props.userData && (
            <ChangeEnvironment
              open={this.state.changeEnvironmentOpen}
              close={() => this.setState({ changeEnvironmentOpen: false })}
              userData={this.props.userData}
              device={
                device ||
                (this.props.environmentData.environment &&
                  this.props.environmentData.environment.devices.filter(
                    device => device.id === this.props.deviceId
                  )[0])
              }
              environments={this.props.environments}
            />
          )}
        {device && device.name && (
          <RenameDevice
            open={this.state.renameOpen}
            close={() => this.setState({ renameOpen: false })}
            device={
              device ||
              (this.props.environmentData.environment &&
                this.props.environmentData.environment.devices.filter(
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
            (this.props.environmentData.environment &&
              this.props.environmentData.environment.devices.filter(
                device => device.id === this.props.deviceId
              )[0])
          }
          deselectDevice={() => this.setState({ goToDevices: true })}
        />
        {(device ||
          (this.props.environmentData.environment &&
            this.props.environmentData.environment.devices.filter(
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
            {(device && device.muted) ||
            ((device ||
              (this.props.environmentData.environment &&
                this.props.environmentData.environment.devices.filter(
                  device => device.id === this.props.deviceId
                )[0])) &&
              (device ||
                (this.props.environmentData.environment &&
                  this.props.environmentData.environment.devices.filter(
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
                disabled={
                  this.props.userData.user && this.props.userData.user.quietMode
                }
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
                disabled={
                  this.props.userData.user && this.props.userData.user.quietMode
                }
              >
                <ListItemIcon>
                  <Icon>notifications_off</Icon>
                </ListItemIcon>
                <ListItemText inset primary="Mute" disableTypography />
              </MenuItem>
            )}
            {device && device.myRole !== "SPECTATOR" && (
              <React.Fragment>
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
                    this.setState({ renameOpen: true })
                    this.handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Icon>mode_edit</Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Rename" disableTypography />
                </MenuItem>
              </React.Fragment>
            )}
            {device &&
              (device.myRole === "OWNER" || device.myRole === "ADMIN") && (
                <React.Fragment>
                  {" "}
                  <MenuItem
                    className="notSelectable"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      this.setState({ changeEnvironmentOpen: true })
                      this.handleMenuClose()
                    }}
                    disabled={
                      !(
                        this.props.environments &&
                        this.props.environments.length > 1
                      )
                    }
                  >
                    <ListItemIcon>
                      <Icon>swap_horiz</Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Move" disableTypography />
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
                </React.Fragment>
              )}
          </Menu>
        )}
        {this.state.goToDevices && (
          <Redirect
            push
            to={
              this.props.environmentData.environment
                ? "/?environment=" + this.props.environmentData.environment.id
                : ""
            }
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
          values {
            id
          }
          myRole
          name
          updatedAt
          createdAt
          muted
          deviceType
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
  )(hotkeys(MainBodyHeader))
)
