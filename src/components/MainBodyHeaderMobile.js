import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui-next/IconButton"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Tooltip from "material-ui-next/Tooltip"
import NotificationsDrawer from "./NotificationsDrawer"
import Icon from "material-ui-next/Icon"
import DeviceInfo from "./DeviceInfo"
import { Menu, MenuItem, ListItemIcon, ListItemText } from "material-ui-next"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link } from "react-router-dom"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
    lessThan600: false,
    anchorEl: null,
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

  updateDimensions() {
    if (window.innerWidth < 600) {
      this.setState({ lessThan600: true })
    } else {
      this.setState({ lessThan600: false })
    }
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    const actions = [<Button onClick={this.handleClose}>Close</Button>]

    const { loading, error, device } = this.props.data

    if (loading) {
      return (
        <div
          className="mainBodyHeader"
          style={this.props.isMobile ? { height: "64px", width: "100vw" } : ""}
        >
          <Tooltip id="tooltip-bottom" title="Device list" placement="bottom">
          <Link
                    to=  "/aurora/"
                    style={{ textDecoration: "none",color:"black" }}
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
                    to=                         "/aurora/"
                    style={{ textDecoration: "none",color:"black" }}
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
          <p className="title" style={{ cursor: "default" }}>
            {device.customName}
          </p>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              gridArea: "buttons",
            }}
          >
            {this.state.lessThan600 ? (
              <React.Fragment>
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
                        mode_edit
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Rearrange cards" />
                  </MenuItem>
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
                  <MenuItem
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
                  </MenuItem>
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
                          navigator
                            .share({
                              title: device.customName + " on Igloo Aurora",
                              text:
                                "Check out " +
                                device.customName +
                                " on Igloo Aurora",
                              url: window.location.href,
                            })
                            .then(() => console.log("Successful share"))
                            .catch(error => console.log("Error sharing", error))
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
                    ""
                  )}
                  {!navigator.share ? (
                    <CopyToClipboard text={window.location.href}>
                      <MenuItem
                        className="notSelectable"
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                        onClick={() => {this.setState({ anchorEl: null })
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
                  ) : (
                    ""
                  )}
                </Menu>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {navigator.share ? (
                  <Tooltip id="tooltip-bottom" title="Share" placement="bottom">
                    <IconButton
                      style={{
                        color: "white",
                      }}
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: device.customName + " on Igloo Aurora",
                              text:
                                "Check out " +
                                device.customName +
                                " on Igloo Aurora",
                              url: window.location.href,
                            })
                            .then(() => console.log("Successful share"))
                            .catch(error => console.log("Error sharing", error))
                        }
                      }}
                    >
                      <Icon>share</Icon>
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
                {!navigator.share ? (
                  <Tooltip
                    id="tooltip-bottom"
                    title="Get link"
                    placement="bottom"
                  >
                    <CopyToClipboard text={window.location.href}>
                      <IconButton
                        style={{
                          color: "white",
                        }}
                   onClick={this.props.openSnackBar}
                      >
                        <Icon>link</Icon>
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                ) : (
                  ""
                )}
                <Tooltip
                  id="tooltip-bottom"
                  title="See on the map"
                  placement="bottom"
                >
                  <IconButton
                    style={{
                      color: "white",
                    }}
                  >
                    <Icon>place</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip
                  id="tooltip-bottom"
                  title="Device information"
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => this.setState({ infoOpen: true })}
                    style={{
                      color: "white",
                    }}
                  >
                    <Icon>info</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip
                  id="tooltip-bottom"
                  title="Rearrange cards"
                  placement="bottom"
                >
                  <IconButton
                    onClick={this.handleOpen}
                    style={{
                      color: "white",
                    }}
                  >
                    <Icon>mode_edit</Icon>
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )}
            <NotificationsDrawer
              device={device}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={this.props.nightMode}
            />
          </div>
        </div>
        <Dialog
          title="Rearrange cards"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className="notSelectable"
        >
          [FILL WITH DRAG 'N' DROPPABLE LIST]
        </Dialog>
        <DeviceInfo
          infoOpen={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          id={device.id}
          updatedAt={device.updatedAt}
          createdAt={device.createdAt}
          devMode={this.props.devMode}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
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
