import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import "./styles/App.css"
import "./styles/MobileApp.css"
import "./styles/Cards.css"
import { hotkeys } from "react-keyboard-shortcuts"
import StatusBar from "./components/devices/StatusBar"
import { Redirect } from "react-router-dom"
import querystringify from "querystringify"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Helmet from "react-helmet"
import AppBar from "@material-ui/core/AppBar"

class Main extends Component {
  state = {
    drawer: false,
    showMainHidden: false,
    hiddenNotifications: false,
    slideIndex: 0,
    areSettingsOpen: false,
  }

  changeDrawerState = () => {
    if (!this.state.areSettingsOpen)
      this.setState(oldState => ({
        drawer: !oldState.drawer,
      }))
  }

  keyenvironmentShortcutHandler = index => {
    const {
      environmentData: { environment },
    } = this.props

    if (this.props.areSettingsOpen) {
      if (
        index < 2 ||
        (typeof Storage !== "undefined" &&
          (localStorage.getItem("devMode") === "true"
            ? index === 2
            : index !== 2))
      ) {
        this.setState({ slideIndex: index })
      }
    } else {
      if (environment) {
        if (this.props.environmentData.environment.devices[index]) {
          if (this.props.devicesSearchText === "") {
            if (
              this.props.environmentData.environment.devices[index].id ===
              querystringify.parse("?" + window.location.href.split("?")[1])
                .device
            ) {
              this.setState({ deselectDevice: true })
            } else {
              this.setState({
                redirectTo: this.props.environmentData.environment.devices[
                  index
                ].id,
              })
            }
          } else {
            this.setState({
              redirectTo: this.props.environmentData.environment.devices.filter(
                device =>
                  device.name
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
              )[index].id,
            })
          }
          this.setState({ drawer: false })
        }
      }
    }
  }

  hot_keys = {
    "alt+s": {
      priority: 1,
      handler: event => {
        !this.state.drawer
          ? this.setState(oldState => ({
              showMainHidden: !oldState.showMainHidden,
            }))
          : this.setState(oldState => ({
              hiddenNotifications: !oldState.hiddenNotifications,
            }))
      },
    },
    "alt+1": {
      priority: 1,
      handler: () => this.keyenvironmentShortcutHandler(0),
    },
    "alt+2": {
      priority: 1,
      handler: () => this.keyenvironmentShortcutHandler(1),
    },
    "alt+3": {
      priority: 1,
      handler: () => this.keyenvironmentShortcutHandler(2),
    },
    "alt+4": {
      priority: 1,
      handler: () => this.keyenvironmentShortcutHandler(3),
      "alt+5": {
        priority: 1,
        handler: () => this.keyenvironmentShortcutHandler(4),
      },
      "alt+6": {
        priority: 1,
        handler: () => this.keyenvironmentShortcutHandler(5),
      },
      "alt+7": {
        priority: 1,
        handler: () => this.keyenvironmentShortcutHandler(6),
      },
      "alt+8": {
        priority: 1,
        handler: () => this.keyenvironmentShortcutHandler(7),
      },
      "alt+9": {
        priority: 1,
        handler: () => this.keyenvironmentShortcutHandler(8),
      },
    },
  }

  constructor() {
    super()

    this.state = {
      showHidden: false,
      isCardFullScreen: false,
      drawer: false,
      copyMessageOpen: false,
      deselectDevice: false,
      slideIndex: 0,
    }
  }

  changeShowHiddenState = () =>
    this.setState(oldState => ({
      showMainHidden: !oldState.showMainHidden,
    }))

  showHiddenNotifications = () =>
    this.setState(oldState => ({
      hiddenNotifications: !oldState.hiddenNotifications,
    }))

  componentDidMount() {
    this.props.environmentData.refetch()

    const deviceUpdatedSubscription = gql`
      subscription {
        deviceUpdated {
          id
          index
          name
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          firmware
          createdAt
          updatedAt
          starred
          notificationCount(filter: { read: false })
          lastReadNotification: lastNotification(filter: { read: true }) {
            id
          }
          lastUnreadNotification: lastNotification(filter: { read: false }) {
            id
            content
            read
          }
        }
      }
    `

    this.props.environmentData.subscribeToMore({
      document: deviceUpdatedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = subscriptionData.data.deviceUpdated.starred
          ? prev.environment.starredDevices
          : prev.environment.devices

        newDevices.forEach(device => {
          if (device.id === subscriptionData.data.deviceUpdated.id) {
            device = subscriptionData.data.deviceUpdated
          }
        })

        return subscriptionData.data.deviceUpdated.starred
          ? {
              environment: {
                ...prev.environment,
                starredDevices: newDevices,
              },
            }
          : {
              environment: {
                ...prev.environment,
                devices: newDevices,
              },
            }
      },
    })

    const deviceCreatedSubscription = gql`
      subscription {
        deviceCreated {
          id
          index
          name
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          firmware
          createdAt
          updatedAt
          starred
          notificationCount(filter: { read: false })
          lastReadNotification: lastNotification(filter: { read: true }) {
            id
          }
          lastUnreadNotification: lastNotification(filter: { read: false }) {
            id
            content
            read
          }
        }
      }
    `

    this.props.environmentData.subscribeToMore({
      document: deviceCreatedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = subscriptionData.data.deviceCreated.starred
          ? [
              ...prev.environment.starredDevices,
              subscriptionData.data.deviceCreated,
            ]
          : [...prev.environment.devices, subscriptionData.data.deviceCreated]

        return subscriptionData.data.deviceCreated.starred
          ? {
              environment: {
                ...prev.environment,
                starredDevices: newDevices,
              },
            }
          : {
              environment: {
                ...prev.environment,
                devices: newDevices,
              },
            }
      },
    })

    const deviceDeletedSubscription = gql`
      subscription {
        deviceDeleted
      }
    `

    this.props.environmentData.subscribeToMore({
      document: deviceDeletedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = prev.environment.starredDevices.some(
          starredDevice =>
            starredDevice.id === subscriptionData.data.deviceDeleted
        )
          ? prev.environment.starredDevices.filter(
              starredDevice =>
                starredDevice.id !== subscriptionData.data.deviceDeleted
            )
          : prev.environment.devices.filter(
              device => device.id !== subscriptionData.data.deviceDeleted
            )

        return prev.environment.starredDevices.some(
          starredDevice =>
            starredDevice.id === subscriptionData.data.deviceDeleted
        )
          ? {
              environment: {
                ...prev.environment,
                starredDevice: newDevices,
              },
            }
          : {
              environment: {
                ...prev.environment,
                devices: newDevices,
              },
            }
      },
    })

    const deviceMovedSubscription = gql`
      subscription {
        deviceMoved {
          id
          index
          name
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          createdAt
          updatedAt
          notificationCount(filter: { read: false })
          environment {
            id
          }
          lastReadNotification: lastNotification(filter: { read: true }) {
            id
          }
          lastUnreadNotification: lastNotification(filter: { read: false }) {
            id
            content
            read
          }
        }
      }
    `

    this.props.environmentData.subscribeToMore({
      document: deviceMovedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        let newDevices
        newDevices = prev.environment.devices.filter(
          device => device.id !== subscriptionData.data.deviceMoved
        )

        return {
          environment: {
            ...prev.environment,
            devices: newDevices,
          },
        }
      },
    })

    const environmentDeletedSubscription = gql`
      subscription {
        environmentDeleted
      }
    `

    this.props.environmentData.subscribeToMore({
      document: environmentDeletedSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        this.setState({ redirectToEnvironments: true })
      },
    })
  }

  render() {
    const {
      environmentData: { error, environment },
    } = this.props

    if (error) {
      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut(true)
      }
    }

    let nightMode = false
    let devMode = false

    if (this.props.devMode) {
      devMode = this.props.devMode
    }

    if (this.state.redirectTo) {
      this.setState({ redirectTo: "" })
    }

    if (this.state.deselectDevice) {
      this.setState({ deselectDevice: false })
    }

    nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {environment &&
            environment.devices.filter(
              device =>
                device.id ===
                querystringify.parse("?" + window.location.href.split("?")[1])
                  .device
            )[0]
              ? querystringify.parse("?" + window.location.href.split("?")[1])
                  .device
                ? "Igloo Aurora - " +
                  environment.devices.filter(
                    device =>
                      device.id ===
                      querystringify.parse(
                        "?" + window.location.href.split("?")[1]
                      ).device
                  )[0].name
                : "Igloo Aurora - " + environment.name
              : "Igloo Aurora"}
          </title>
        </Helmet>
        {this.props.mobile ? (
          <div className="mobileMain" style={{ overflowY: "hidden" }}>
            {this.props.selectedDevice == null ? (
              <React.Fragment>
                <AppBar>
                  <SidebarHeader
                    logOut={this.props.logOut}
                    key="sidebarHeader"
                    selectedEnvironment={this.props.environmentId}
                    areSettingsOpen={this.props.areSettingsOpen}
                    openSettingsDialog={this.props.openSettings}
                    closeSettings={this.props.closeSettings}
                    changeSettingsState={() =>
                      this.setState(oldState => ({
                        areSettingsOpen: !oldState.areSettingsOpen,
                        drawer: false,
                      }))
                    }
                    environments={this.props.environments}
                    snackbarOpen={this.props.snackbarOpen}
                  />
                </AppBar>
                <div
                  key="sidebar"
                  style={
                    nightMode
                      ? {
                          background: "#21252b",
                          height: "calc(100vh - 64px)",
                          marginTop: "64px",
                          overflowY: "hidden",
                        }
                      : {
                          background: "white",
                          height: "calc(100vh - 64px)",
                          marginTop: "64px",
                          overflowY: "hidden",
                        }
                  }
                >
                  <Sidebar
                    selectDevice={id => {
                      this.props.selectDevice(id)
                      this.setState({ drawer: false })
                    }}
                    selectedDevice={this.props.selectedDevice}
                    changeDrawerState={this.changeDrawerState}
                    isMobile={true}
                    environmentData={this.props.environmentData}
                    nightMode={nightMode}
                    selectedEnvironment={this.props.environmentId}
                    searchDevices={this.props.searchDevices}
                    searchText={this.props.devicesSearchText}
                    snackbarOpen={this.props.snackbarOpen}
                    userData={this.props.userData}
                  />
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AppBar>
                  <MainBodyHeader
                    deviceId={this.props.selectedDevice}
                    key="mainBodyHeader"
                    drawer={this.state.drawer}
                    changeDrawerState={this.changeDrawerState}
                    hiddenNotifications={this.state.hiddenNotifications}
                    showHiddenNotifications={this.showHiddenNotifications}
                    nightMode={nightMode}
                    devMode={devMode}
                    environmentData={this.props.environmentData}
                    environments={this.props.environments}
                    isMobile={true}
                    userData={this.props.userData}
                  />
                </AppBar>
                <div
                  key="mainBody"
                  style={
                    nightMode
                      ? {
                          background: "#2f333d",
                          marginTop: "64px",
                          overflowY: "auto",
                        }
                      : {
                          background: "white",
                          marginTop: "64px",
                          overflowY: "auto",
                        }
                  }
                >
                  <MainBody
                    deviceId={this.props.selectedDevice}
                    showHidden={this.state.showMainHidden}
                    changeShowHiddenState={this.changeShowHiddenState}
                    isMobile={true}
                    nightMode={nightMode}
                    devMode={devMode}
                    environmentData={this.props.environmentData}
                    userData={this.props.userData}
                  />
                </div>
                <StatusBar
                  environmentData={this.props.environmentData}
                  deviceId={this.props.selectedDevice}
                  nightMode={nightMode}
                  isMobile={true}
                />
              </React.Fragment>
            )}
          </div>
        ) : (
          <div className="main">
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader
              logOut={this.props.logOut}
              key="sidebarHeader"
              selectedEnvironment={this.props.environmentId}
              areSettingsOpen={this.props.areSettingsOpen}
              openSettingsDialog={this.props.openSettings}
              closeSettings={this.props.closeSettings}
              changeSettingsState={() =>
                this.setState(oldState => ({
                  areSettingsOpen: !oldState.areSettingsOpen,
                  drawer: false,
                }))
              }
              environments={this.props.environments}
            />
            <div
              className="sidebar"
              key="sidebar"
              style={
                nightMode
                  ? { background: "#21252b" }
                  : { background: "#f2f2f2" }
              }
            >
              <Sidebar
                selectDevice={id => {
                  this.props.selectDevice(id)
                  this.setState({ drawer: false })
                }}
                selectedDevice={this.props.selectedDevice}
                changeDrawerState={this.changeDrawerState}
                environmentData={this.props.environmentData}
                nightMode={nightMode}
                selectedEnvironment={this.props.environmentId}
                searchDevices={this.props.searchDevices}
                searchText={this.props.devicesSearchText}
                userData={this.props.userData}
              />
            </div>
            {this.props.selectedDevice !== null ? (
              <MainBodyHeader
                deviceId={this.props.selectedDevice}
                key="mainBodyHeader"
                drawer={this.state.drawer}
                changeDrawerState={this.changeDrawerState}
                hiddenNotifications={this.state.hiddenNotifications}
                showHiddenNotifications={this.showHiddenNotifications}
                nightMode={nightMode}
                devMode={devMode}
                openSnackBar={() => {
                  this.setState({ copyMessageOpen: true })
                }}
                environmentData={this.props.environmentData}
                environments={this.props.environments}
                userData={this.props.userData}
              />
            ) : (
              <div
                style={{
                  gridArea: "mainBodyHeader",
                  backgroundColor: "#0083ff",
                }}
                key="mainBodyHeader"
              />
            )}
            {this.props.selectedDevice !== null ? (
              <React.Fragment>
                <MainBody
                  deviceId={this.props.selectedDevice}
                  showHidden={this.state.showMainHidden}
                  changeShowHiddenState={this.changeShowHiddenState}
                  nightMode={nightMode}
                  devMode={devMode}
                  environmentData={this.props.environmentData}
                  isMobile={false}
                  logOut={this.props.logOut}
                  environments={this.props.environments}
                  userData={this.props.userData}
                />
                <StatusBar
                  environmentData={this.props.environmentData}
                  deviceId={this.props.selectedDevice}
                  nightMode={nightMode}
                  isMobile={false}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { background: "#2f333d" }
                      : { background: "white" }
                  }
                  className="mainBody"
                >
                  <div
                    className={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? "darkMainBodyBG"
                        : "mainBodyBG"
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div
                  className="statusBar"
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { background: "#2f333d" }
                      : { background: "white" }
                  }
                />
              </React.Fragment>
            )}
          </div>
        )}
        {this.state.redirectTo && environment && (
          <Redirect
            push
            to={
              "/?environment=" +
              environment.id +
              "&device=" +
              this.state.redirectTo
            }
          />
        )}
        {this.state.deselectDevice && environment && (
          <Redirect push to={"/?environment=" + environment.id} />
        )}

        {this.state.redirectToEnvironments && <Redirect push to="/" />}
      </React.Fragment>
    )
  }
}

export default graphql(
  localStorage.getItem("sortBy") === "name"
    ? localStorage.getItem("sortDirection") === "ascending"
      ? gql`
          query($id: ID!) {
            environment(id: $id) {
              id
              name
              starredDevices: devices(
                filter: { starred: true }
                sortBy: name
                sortDirection: ASCENDING
              ) {
                id
                index
                name
                online
                batteryStatus
                batteryCharging
                signalStatus
                deviceType
                firmware
                createdAt
                updatedAt
                starred
                notificationCount(filter: { read: false })
                lastReadNotification: lastNotification(filter: { read: true }) {
                  id
                }
                lastUnreadNotification: lastNotification(
                  filter: { read: false }
                ) {
                  id
                  content
                  read
                }
              }
              devices(
                filter: { starred: false }
                sortBy: name
                sortDirection: ASCENDING
              ) {
                id
                index
                name
                online
                batteryStatus
                batteryCharging
                signalStatus
                deviceType
                firmware
                createdAt
                updatedAt
                starred
                notificationCount(filter: { read: false })
                lastReadNotification: lastNotification(filter: { read: true }) {
                  id
                }
                lastUnreadNotification: lastNotification(
                  filter: { read: false }
                ) {
                  id
                  content
                  read
                }
              }
            }
          }
        `
      : gql`
          query($id: ID!) {
            environment(id: $id) {
              id
              name
              starredDevices: devices(
                filter: { starred: true }
                sortBy: name
                sortDirection: DESCENDING
              ) {
                id
                index
                name
                online
                batteryStatus
                batteryCharging
                signalStatus
                deviceType
                firmware
                createdAt
                updatedAt
                starred
                notificationCount(filter: { read: false })
                lastReadNotification: lastNotification(filter: { read: true }) {
                  id
                }
                lastUnreadNotification: lastNotification(
                  filter: { read: false }
                ) {
                  id
                  content
                  read
                }
              }
              devices(
                filter: { starred: false }
                sortBy: name
                sortDirection: DESCENDING
              ) {
                id
                index
                name
                online
                batteryStatus
                batteryCharging
                signalStatus
                deviceType
                firmware
                createdAt
                updatedAt
                starred
                notificationCount(filter: { read: false })
                lastReadNotification: lastNotification(filter: { read: true }) {
                  id
                }
                lastUnreadNotification: lastNotification(
                  filter: { read: false }
                ) {
                  id
                  content
                  read
                }
              }
            }
          }
        `
    : gql`
        query($id: ID!) {
          environment(id: $id) {
            id
            name
            devices(sortBy: index) {
              id
              index
              name
              online
              batteryStatus
              batteryCharging
              signalStatus
              deviceType
              firmware
              createdAt
              updatedAt
              starred
              notificationCount(filter: { read: false })
              lastReadNotification: lastNotification(filter: { read: true }) {
                id
              }
              lastUnreadNotification: lastNotification(
                filter: { read: false }
              ) {
                id
                content
                read
              }
            }
          }
        }
      `,
  {
    name: "environmentData",
    options: ({ environmentId }) => ({ variables: { id: environmentId } }),
  }
)(hotkeys(Main))
