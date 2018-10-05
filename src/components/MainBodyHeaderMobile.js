import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./devices/DeviceInfo"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link } from "react-router-dom"
import {
  Divider,
    Tooltip,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core"
import DeleteDevice from "./devices/DeleteDevice"
import ChangeBoard from "./devices/ChangeBoard"
import RenameDevice from "./devices/RenameDevice"

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
    const { loading, error, device } = this.props.data

    const toggleQuietMode = quietMode =>
      this.props.ToggleQuietMode({
        variables: {
          id: device.id,
          quietMode,
        },
        optimisticResponse: {
          __typename: "Mutation",
          device: {
            id: device.id,
            quietMode,
            __typename: "Device",
          },
        },
      })

    if (loading) {
      return (
        <div
          className="mainBodyHeader"
          style={{ height: "64px", width: "100vw" }}
        >
          <Tooltip id="tooltip-bottom" title="Devices" placement="bottom">
            <Link
              to="/dashboard/"
              style={{ textDecoration: "none", color: "white" }}
            >
              <IconButton
                style={{
                  color: "white",
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "8px",
                }}
                onClick={() => this.props.selectDevice(null)}
              >
                <Icon>chevron_left</Icon>
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      )
    }

    if (error) {
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div
          className="mobileMainBodyHeader notSelectable"
          style={{
            color: "white",
            height: "64px",
          }}
        >
          <div className="mobileBackIcon">
            <Tooltip id="tooltip-bottom" title="Device list" placement="bottom">
              <Link
                to={"/dashboard?board=" + this.props.selectedBoard}
                style={{ textDecoration: "none", color: "black" }}
              >
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => this.props.selectDevice(null)}
                >
                  <Icon>chevron_left</Icon>
                </IconButton>
              </Link>
            </Tooltip>
          </div>
          {device.icon ? (
            <img
              className="deviceIconBig"
              src={device.icon}
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
            {" "}
            {device.customName}
          </Typography>
          {device && (
            <div
              style={{
                padding: "0",
                marginLeft: "auto",
                marginRight: "8px",
                float: "right",
                gridArea: "buttons",
              }}
            >
              <Tooltip id="tooltip-more" title="More" placement="bottom">
                <IconButton
                  style={{ color: "white" }}
                  onClick={this.handleMenuOpen}
                >
                  <Icon>more_vert</Icon>
                </IconButton>
              </Tooltip>
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
                    this.props.nightMode
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
                        this.props.nightMode
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
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        place
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="See on the map" />
                  </MenuItem> */}
                {navigator.share ? (
                  <MenuItem
                    className="notSelectable"
                    style={
                      this.props.nightMode
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
                          this.props.nightMode
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
                        this.props.nightMode
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
                            this.props.nightMode
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
                )}
                <Divider />
                {device.quietMode ? (
                  <MenuItem
                    className="notSelectable"
                    style={
                      this.props.nightMode
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
                          this.props.nightMode
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
                      this.props.nightMode
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
                          this.props.nightMode
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
                      this.props.nightMode
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
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        swap_vert
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Change board" />
                  </MenuItem>
                )}
                {device.values.length > 1 && (
                  <MenuItem
                    className="notSelectable"
                    style={
                      this.props.nightMode
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
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        swap_vert
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Rearrange cards" />
                  </MenuItem>
                )}
                <MenuItem
                  className="notSelectable"
                  style={
                    this.props.nightMode
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
                        this.props.nightMode
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
                    this.props.nightMode
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
                device={device}
                drawer={this.props.drawer}
                changeDrawerState={this.props.changeDrawerState}
                hiddenNotifications={this.props.hiddenNotifications}
                showHiddenNotifications={this.props.showHiddenNotifications}
                nightMode={this.props.nightMode}
              />
            </div>
          )}
        </div>
        <DeviceInfo
          infoOpen={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          id={device.id}
          updatedAt={device.updatedAt}
          createdAt={device.createdAt}
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
          quietMode
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
