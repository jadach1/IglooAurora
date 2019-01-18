import React, { Component } from "react"
import CenteredSpinner from "./CenteredSpinner"
import FilterPopover from "./FilterPopover"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import Tooltip from "@material-ui/core/Tooltip"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import List from "@material-ui/core/List"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"
import Zoom from "@material-ui/core/Zoom"
import AddDevice from "./AddDevice"
import { hotkeys } from "react-keyboard-shortcuts"
import { Link, Redirect } from "react-router-dom"
import queryString from "query-string"
import FilterList from "@material-ui/icons/FilterList"
import Add from "@material-ui/icons/Add"
import Search from "@material-ui/icons/Search"
import Clear from "@material-ui/icons/Clear"

class Sidebar extends Component {
  state = {
    popoverOpen: false,
    dialOpen: false,
    visibleDeviceTypes: [],
    hidden: false,
    addDeviceOpen: false,
    lessThan1080: false,
  }

  hot_keys = {
    "alt+a": {
      priority: 1,
      handler: event => {
        this.setState(oldState => ({ addDeviceOpen: !oldState.addDeviceOpen }))
      },
    },
  }

  updateDimensions() {
    if (window.innerWidth < 1080) {
      this.setState({ lessThan1080: true })
    } else {
      this.setState({ lessThan1080: false })
    }
  }

  componentWillMount() {
    if (
      window.Windows &&
      window.Windows.UI.Core.SystemNavigationManager &&
      window.Windows.UI.Core.SystemNavigationManager.getForCurrentView()
        .appViewBackButtonVisibility !== 2
    ) {
      window.Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = 2
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
    const {
      environmentData: { loading, error, environment },
    } = this.props

    let sidebarContent = ""

    if (loading) {
      sidebarContent = (
        <CenteredSpinner
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? {
                  height: "calc(100% - 96px)",
                  paddingTop: "32px",
                }
              : { height: "calc(100% - 96px)", paddingTop: "32px" }
          }
        />
      )
    }

    if (error) {
      sidebarContent = "Unexpected error"

      if (
        error.message === "GraphQL error: This id is not valid" ||
        error.message === "GraphQL error: The requested resource does not exist"
      ) {
        if (
          queryString.parse("?" + window.location.href.split("?")[1]).device
        ) {
          // if a device is selected the sidebar keeps loading, waiting for the device to redirect the user
          sidebarContent = (
            <CenteredSpinner
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      height: "calc(100% - 96px)",
                      paddingTop: "32px",
                    }
                  : { height: "calc(100% - 96px)", paddingTop: "32px" }
              }
            />
          )
        } else {
          // if there's no environment with the id in the url and no device is selected, the user gets redirected
          return <Redirect to="/" />
        }
      }
    }

    let devicesArray = []

    if (environment) {
      devicesArray = this.props.searchText
        ? environment.devices
            .filter(device =>
              device.name
                .toLowerCase()
                .includes(this.props.searchText.toLowerCase())
            )
            .filter(
              device =>
                this.state.visibleDeviceTypes.indexOf(device.deviceType) !== -1
            )
        : environment.devices.filter(
            device =>
              this.state.visibleDeviceTypes.indexOf(device.deviceType) !== -1
          )

      sidebarContent = (
        <React.Fragment>
          <FilterPopover
            open={this.state.popoverOpen}
            environmentId={this.props.selectedEnvironment}
            currentDevice={
              environment.devices.filter(
                device => device.id === this.props.selectedDevice
              )[0]
            }
            close={() => this.setState({ popoverOpen: false })}
            anchorEl={this.anchorEl}
            devices={environment.devices}
            setVisibleTypes={visibleTypes => {
              this.setState({ visibleDeviceTypes: visibleTypes })
            }}
            nightMode={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
            }
          />
          <List
            style={{
              padding: "0",
              height: "calc(100vh - 128px)",
              overflow: "auto",
              overscrollBehaviorY: "contain",
            }}
          >
            {devicesArray
              .filter(device => device.name.toLowerCase())
              .filter(
                device =>
                  this.state.visibleDeviceTypes.indexOf(device.deviceType) !==
                  -1
              )
              .map(device => (
                <ListItem
                  button
                  component={Link}
                  to={
                    this.props.selectedDevice !== device.id
                      ? "/?environment=" +
                        this.props.selectedEnvironment +
                        "&device=" +
                        device.id
                      : "/?environment=" + this.props.selectedEnvironment
                  }
                  className="notSelectable"
                  selected={this.props.selectedDevice === device.id}
                  key={device.id}
                >
                  <ListItemText
                    primary={
                      <span
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        {device.name}
                      </span>
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                    secondary={
                      <span
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "#c1c2c5" }
                            : { color: "#7a7a7a" }
                        }
                      >
                        {device.notifications
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
                          : "No notifications"}
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Badge
                      badgeContent={device.notificationCount}
                      invisible={!device.notificationCount}
                      color="primary"
                      className="notSelectable"
                      style={{ marginRight: "24px", cursor: "pointer" }}
                      onClick={() => {
                        this.props.changeDrawerState()
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          <Zoom in={environment}>
            <Button
              variant="fab"
              color="secondary"
              style={
                this.props.isMobile
                  ? this.props.snackbarOpen
                    ? {
                        position: "absolute",
                        right: "20px",
                        bottom: "20px",
                        transform: "translate3d(0, -64px, 0)",
                        transition:
                          "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                      }
                    : {
                        position: "absolute",
                        right: "20px",
                        bottom: "20px",
                        transition:
                          "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                      }
                  : this.state.lessThan1080
                  ? {
                      position: "absolute",
                      left: "calc(33vw - 76px)",
                      bottom: "20px",
                      transition:
                        "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                    }
                  : {
                      position: "absolute",
                      left: "284px",
                      bottom: "20px",
                      transition:
                        "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
                    }
              }
              onClick={() => this.setState({ addDeviceOpen: true })}
            >
              <Add />
            </Button>
          </Zoom>
          <AddDevice
            open={this.state.addDeviceOpen}
            close={() => this.setState({ addDeviceOpen: false })}
          />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <div style={{ width: "100%", height: "64px" }}>
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
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
              disabled={
                !(
                  environment &&
                  environment.devices.filter(
                    device =>
                      this.state.visibleDeviceTypes.indexOf(
                        device.deviceType
                      ) !== -1
                  )[0]
                )
              }
              value={this.props.searchText}
              onChange={event => this.props.searchDevices(event.target.value)}
              startAdornment={
                <InputAdornment position="start" style={{ cursor: "default" }}>
                  <Search
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? !(
                            environment &&
                            environment.devices.filter(
                              device =>
                                this.state.visibleDeviceTypes.indexOf(
                                  device.deviceType
                                ) !== -1
                            )[0]
                          )
                          ? { color: "white", opacity: "0.5" }
                          : { color: "white" }
                        : !(
                            environment &&
                            environment.devices.filter(
                              device =>
                                this.state.visibleDeviceTypes.indexOf(
                                  device.deviceType
                                ) !== -1
                            )[0]
                          )
                        ? { color: "black", opacity: "0.5" }
                        : { color: "black" }
                    }
                  />
                </InputAdornment>
              }
              endAdornment={
                this.props.searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.props.searchDevices("")}
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>
          <Tooltip id="tooltip-bottom" title="Filters" placement="bottom">
            <IconButton
              buttonRef={node => {
                this.anchorEl = node
              }}
              onClick={() => {
                this.setState({ popoverOpen: true })
              }}
              disabled={
                !(
                  environment &&
                  environment.devices.filter(device =>
                    this.props.searchText
                      ? device.name
                          .toLowerCase()
                          .includes(this.props.searchText.toLowerCase())
                      : true
                  )[0]
                )
              }
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white", marginTop: "8px" }
                  : { color: "black", marginTop: "8px" }
              }
            >
              <FilterList
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? environment &&
                      environment.devices &&
                      environment.devices.filter(device =>
                        this.props.searchText
                          ? device.name
                              .toLowerCase()
                              .includes(this.props.searchText.toLowerCase())
                          : true
                      )[0]
                      ? { color: "white" }
                      : { color: "white", opacity: "0.5" }
                    : environment &&
                      environment.devices &&
                      environment.devices.filter(device =>
                        this.props.searchText
                          ? true
                          : device.name
                              .toLowerCase()
                              .includes(this.props.searchText.toLowerCase())
                      )[0]
                    ? { color: "black" }
                    : { color: "black", opacity: "0.5" }
                }
              />
            </IconButton>
          </Tooltip>
        </div>
        {sidebarContent}
      </React.Fragment>
    )
  }
}

export default hotkeys(Sidebar)
