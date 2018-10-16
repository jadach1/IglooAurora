import React, { Component } from "react"
import CenteredSpinner from "./CenteredSpinner"
import FilterPopover from "./FilterPopover"
import { Link } from "react-router-dom"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import Tooltip from "@material-ui/core/Tooltip"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import List from "@material-ui/core/List"
import InputAdornment from "@material-ui/core/InputAdornment"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#ff4081" },
  },
})

const theme2 = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class Sidebar extends Component {
  state = {
    popoverOpen: false,
    dialOpen: false,
    visibleDeviceTypes: [],
    hidden: false,
  }

  handleMouseDownSearch = event => {
    event.preventDefault()
  }

  handleClickCancelSearch = () => {
    this.props.searchDevices("")
  }

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    if (loading) {
      return <CenteredSpinner />
    }

    if (error) {
      return "Unexpected error"
    }

    return (
      <React.Fragment>
        <div style={{ width: "100%", height: "64px" }}>
          <MuiThemeProvider theme={theme2}>
            <FormControl
              style={{
                margin: "16px 8px 0 16px",
                width: "calc(100% - 80px)",
              }}
            >
              <Input
                id="adornment-devices"
                placeholder="Search devices"
                color="primary"
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                disabled={
                  !user.devices
                    .filter(
                      device =>
                        this.state.visibleDeviceTypes.indexOf(
                          device.deviceType
                        ) !== -1
                    )
                    .filter(
                      device => device.board.id === this.props.selectedBoard
                    )[0]
                }
                value={this.props.searchText}
                onChange={event => this.props.searchDevices(event.target.value)}
                startAdornment={
                  <InputAdornment
                    position="start"
                    style={{ cursor: "default" }}
                  >
                    <Icon
                      style={
                        this.props.nightMode
                          ? !user.devices
                              .filter(
                                device =>
                                  this.state.visibleDeviceTypes.indexOf(
                                    device.deviceType
                                  ) !== -1
                              )
                              .filter(
                                device =>
                                  device.board.id === this.props.selectedBoard
                              )[0]
                            ? { color: "white", opacity: "0.5" }
                            : { color: "white" }
                          : !user.devices
                              .filter(
                                device =>
                                  this.state.visibleDeviceTypes.indexOf(
                                    device.deviceType
                                  ) !== -1
                              )
                              .filter(
                                device =>
                                  device.board.id === this.props.selectedBoard
                              )[0]
                            ? { color: "black", opacity: "0.5" }
                            : { color: "black" }
                      }
                    >
                      search
                    </Icon>
                  </InputAdornment>
                }
                endAdornment={
                  this.props.searchText ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickCancelSearch}
                        onMouseDown={this.handleMouseDownSearch}
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
          </MuiThemeProvider>
          <Tooltip id="tooltip-bottom" title="Filters" placement="bottom">
            <IconButton
              style={{ marginTop: "-16px" }}
              buttonRef={node => {
                this.anchorEl = node
              }}
              onClick={() => {
                this.setState({ popoverOpen: true })
              }}
              disabled={
                !user.devices
                  .filter(
                    device => device.board.id === this.props.selectedBoard
                  )
                  .filter(
                    device =>
                      this.props.searchText
                        ? device.customName
                            .toLowerCase()
                            .includes(this.props.searchText.toLowerCase())
                        : true
                  )[0]
              }
            >
              <Icon
                style={
                  this.props.nightMode
                    ? !user.devices
                        .filter(
                          device => device.board.id === this.props.selectedBoard
                        )
                        .filter(
                          device =>
                            this.props.searchText
                              ? device.customName
                                  .toLowerCase()
                                  .includes(this.props.searchText.toLowerCase())
                              : true
                        )[0]
                      ? { color: "white", opacity: "0.5" }
                      : { color: "white" }
                    : !user.devices
                        .filter(
                          device => device.board.id === this.props.selectedBoard
                        )
                        .filter(
                          device =>
                            this.props.searchText
                              ? device.customName
                                  .toLowerCase()
                                  .includes(this.props.searchText.toLowerCase())
                              : true
                        )[0]
                      ? { color: "black", opacity: "0.5" }
                      : { color: "black" }
                }
              >
                filter_list
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
        <FilterPopover
          open={this.state.popoverOpen}
          boardId={this.props.selectedBoard}
          currentDevice={
            user.devices.filter(
              device => device.id === this.props.selectedDevice
            )[0]
          }
          close={() => this.setState({ popoverOpen: false })}
          anchorEl={this.anchorEl}
          devices={user.devices}
          setVisibleTypes={visibleTypes => {
            this.setState({ visibleDeviceTypes: visibleTypes })
          }}
          nightMode={this.props.nightMode}
        />
        <List
          style={{
            padding: "0",
            height: "calc(100vh - 128px)",
            overflow: "auto",
          }}
        >
          {this.props.searchText
            ? user.devices
                .filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.searchText.toLowerCase())
                )
                .filter(
                  device =>
                    this.state.visibleDeviceTypes.indexOf(device.deviceType) !==
                    -1
                )
                .filter(device => device.board.id === this.props.selectedBoard)
                .map(device => (
                  <Link
                    to={
                      this.props.selectedDevice !== device.id
                        ? "/dashboard?board=" +
                          this.props.selectedBoard +
                          "&device=" +
                          device.id
                        : "/dashboard?board=" + this.props.selectedBoard
                    }
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    <ListItem
                      button
                      className="notSelectable"
                      style={
                        this.props.selectedDevice === device.id &&
                        !this.props.isMobile
                          ? this.props.nightMode
                            ? { backgroundColor: "#282c34" }
                            : { backgroundColor: "#d4d4d4" }
                          : null
                      }
                      key={device.id}
                    >
                      <ListItemIcon>
                        {device.icon ? (
                          <img
                            className="deviceIcon"
                            src={device.icon}
                            alt="device logo"
                          />
                        ) : (
                          <Icon
                            style={
                              this.props.nightMode
                                ? { color: "#c1c2c5" }
                                : { color: "#7a7a7a" }
                            }
                          >
                            lightbulb_outline
                          </Icon>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        primary={device.customName}
                        secondary={
                          device.notifications
                            .filter(
                              notification => notification.visualized === false
                            )
                            .map(notification => notification.content)
                            .reverse()[0]
                            ? device.notifications
                                .filter(
                                  notification =>
                                    notification.visualized === false
                                )
                                .map(notification => notification.content)
                                .reverse()[0]
                            : device.notifications
                                .filter(
                                  notification =>
                                    notification.visualized === true
                                )
                                .map(notification => notification.content)
                                .reverse()[0]
                              ? "No unread notifications"
                              : "No notifications"
                        }
                      />
                      {device.notifications
                        .filter(
                          notification => notification.visualized === false
                        )
                        .map(notification => notification.content)
                        .reverse()[0] ? (
                        <ListItemSecondaryAction>
                          <MuiThemeProvider theme={theme}>
                            <Badge
                              badgeContent={
                                device.notifications.filter(
                                  notification =>
                                    notification.visualized === false
                                ).length
                              }
                              color="primary"
                              className="notSelectable sidebarBadge"
                              style={{ marginRight: "24px" }}
                              onClick={() => {
                                this.props.changeDrawerState()
                              }}
                            />
                          </MuiThemeProvider>
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                  </Link>
                ))
            : user.devices
                .filter(device => device.customName.toLowerCase())
                .filter(
                  device =>
                    this.state.visibleDeviceTypes.indexOf(device.deviceType) !==
                    -1
                )
                .filter(device => device.board.id === this.props.selectedBoard)
                .map(device => (
                  <Link
                    to={
                      this.props.selectedDevice !== device.id
                        ? "/dashboard?board=" +
                          this.props.selectedBoard +
                          "&device=" +
                          device.id
                        : "/dashboard?board=" + this.props.selectedBoard
                    }
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      button
                      className="notSelectable"
                      style={
                        this.props.selectedDevice === device.id
                          ? this.props.nightMode
                            ? { backgroundColor: "#282c34" }
                            : { backgroundColor: "#d4d4d4" }
                          : null
                      }
                      key={device.id}
                    >
                      <ListItemIcon>
                        {device.icon ? (
                          <img
                            className="deviceIcon"
                            src={device.icon}
                            alt="device logo"
                          />
                        ) : (
                          <Icon
                            style={
                              this.props.nightMode
                                ? { color: "#c1c2c5" }
                                : { color: "#7a7a7a" }
                            }
                          >
                            lightbulb_outline
                          </Icon>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={device.customName}
                        style={{
                          cursor: "default",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        secondary={
                          device.notifications
                            .filter(
                              notification => notification.visualized === false
                            )
                            .map(notification => notification.content)
                            .reverse()[0]
                            ? device.notifications
                                .filter(
                                  notification =>
                                    notification.visualized === false
                                )
                                .map(notification => notification.content)
                                .reverse()[0]
                            : device.notifications
                                .filter(
                                  notification =>
                                    notification.visualized === true
                                )
                                .map(notification => notification.content)
                                .reverse()[0]
                              ? "No unread notifications"
                              : "No notifications"
                        }
                      />
                      {device.notifications
                        .filter(
                          notification => notification.visualized === false
                        )
                        .map(notification => notification.content)
                        .reverse()[0] ? (
                        <ListItemSecondaryAction>
                          <MuiThemeProvider theme={theme}>
                            <Badge
                              badgeContent={
                                device.notifications.filter(
                                  notification =>
                                    notification.visualized === false
                                ).length
                              }
                              color="primary"
                              className="notSelectable sidebarBadge"
                              style={{ marginRight: "24px" }}
                              onClick={() => {
                                this.props.changeDrawerState()
                              }}
                            />
                          </MuiThemeProvider>
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                  </Link>
                ))}
        </List>
        <MuiThemeProvider theme={theme}>
          <Button
            variant="fab"
            color="primary"
            style={
              this.props.isMobile
                ? {
                    position: "absolute",
                    right: "20px",
                    bottom: "20px",
                    transition:
                      "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                  }
                : {
                    position: "absolute",
                    left: "308px",
                    bottom: "20px",
                    transition:
                      "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                  }
            }
          >
            <Icon>format_list_bulleted</Icon>
          </Button>
        </MuiThemeProvider>
      </React.Fragment>
    )
  }
}

export default Sidebar
