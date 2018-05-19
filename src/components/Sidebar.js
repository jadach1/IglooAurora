import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
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
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.user.devices,
          subscriptionData.data.deviceCreated,
        ]
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })

    const updateQuery = gql`
      subscription {
        deviceUpdated {
          id
          customName
          icon
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: updateQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevice = subscriptionData.deviceUpdated
        const newDevices = prev.user.devices.map(
          device => (device.id === newDevice.id ? newDevice : device)
        )
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })
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
      return <p>{error.message}</p>
    }

    return (
      <React.Fragment>
        <div style={{ height: "100%" }}>
          <MuiThemeProvider theme={theme2}>
            <TextField
              placeholder="Search devices"
              color="primary"
              className="notSelectable"
              style={{
                width: "calc(100% - 32px)",
                margin: "8px 16px 0 16px",
              }}
              value={this.props.searchText}
              onChange={event => this.props.changeText(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
                endAdornment: this.props.searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickCancelSearch}
                      onMouseDown={this.handleMouseDownSearch}
                      style={{ width: "32px", height: "32px" }}
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </MuiThemeProvider>
          <List>
            {this.props.searchText
              ? user.devices
                  .filter(device =>
                    device.customName
                      .toLowerCase()
                      .includes(this.props.searchText.toLowerCase())
                  )
                  .map(device => (
                    <ListItem
                      button
                      className="notSelectable"
                      style={
                        this.props.selectedDevice === device.id
                          ? { backgroundColor: "#d4d4d4" }
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
                          <Icon>lightbulb_outline</Icon>
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
                  .map(device => (
                    <ListItem
                      button
                      className="notSelectable"
                      style={
                        this.props.selectedDevice === device.id
                          ? { backgroundColor: "#d4d4d4" }
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
                          <Icon>lightbulb_outline</Icon>
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
        </div>
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

export default graphql(
  gql`
    query {
      user {
        devices {
          id
          customName
          icon
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    }
  `,
  { name: "userData" }
)(Sidebar)
