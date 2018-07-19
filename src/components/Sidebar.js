import React, { Component } from "react"
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "material-ui-next/List"
import CenteredSpinner from "./CenteredSpinner"
import FloatingActionButton from "material-ui/FloatingActionButton"
import Tooltip from "material-ui-next/Tooltip"
import Badge from "material-ui-next/Badge"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import TextField from "material-ui-next/TextField"
import { InputAdornment } from "material-ui-next/Input"
import IconButton from "material-ui-next/IconButton"
import FilterPopover from "./FilterPopover"

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
  state = { popoverOpen: false, visibleDeviceTypes: []
   }

  listItemClick = device => {
    if (this.props.selectedDevice !== device.id) {
      this.props.selectDevice(device.id)
    } else {
      this.props.selectDevice(null)
    }
  }

  handleMouseDownSearch = event => {
    event.preventDefault()
  }

  handleClickCancelSearch = () => {
    this.props.changeText("")
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
            <TextField
              placeholder="Search devices"
              color="primary"
              className="notSelectable"
              style={{
                margin: "16px 8px 0 16px",
                width: "calc(100% - 80px)",
              }}
              value={this.props.searchText}
              onChange={event => this.props.changeText(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ cursor: "default" }}
                  >
                    <Icon
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      search
                    </Icon>
                  </InputAdornment>
                ),
                endAdornment: this.props.searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickCancelSearch}
                      onMouseDown={this.handleMouseDownSearch}
                    >
                      <Icon
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        clear
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
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
            >
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                filter_list
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
        <FilterPopover
          open={this.state.popoverOpen}
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
                .map(device => (
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
                    onClick={() => this.listItemClick(device)}
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
                                notification => notification.visualized === true
                              )
                              .map(notification => notification.content)
                              .reverse()[0]
                            ? "No unread notifications"
                            : "No notifications"
                      }
                    />
                    {device.notifications
                      .filter(notification => notification.visualized === false)
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
                              if (this.props.selectedDevice !== device.id) {
                                this.listItemClick(device)
                              }
                            }}
                          />
                        </MuiThemeProvider>
                      </ListItemSecondaryAction>
                    ) : null}
                  </ListItem>
                ))
            : user.devices
                .filter(device => device.customName.toLowerCase())
                .filter(
                  device =>
                    this.state.visibleDeviceTypes.indexOf(device.deviceType) !==
                    -1
                )
                .map(device => (
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
                    onClick={() => this.listItemClick(device)}
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
                                notification => notification.visualized === true
                              )
                              .map(notification => notification.content)
                              .reverse()[0]
                            ? "No unread notifications"
                            : "No notifications"
                      }
                    />
                    {device.notifications
                      .filter(notification => notification.visualized === false)
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
                              if (this.props.selectedDevice !== device.id) {
                                this.listItemClick(device)
                              }
                            }}
                          />
                        </MuiThemeProvider>
                      </ListItemSecondaryAction>
                    ) : null}
                  </ListItem>
                ))}
        </List>

        <Tooltip id="tooltip-bottom" title="Edit list" placement="bottom">
          <FloatingActionButton
            className={
              this.props.isMobile
                ? "notSelectable mobileDeviceEditFab"
                : "notSelectable deviceEditFab"
            }
            backgroundColor="#ff4081"
            style={{
              transition:
                "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
            }}
          >
            <Icon>mode_edit</Icon>
          </FloatingActionButton>
        </Tooltip>
      </React.Fragment>
    )
  }
}

export default Sidebar
