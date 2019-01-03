import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import "./styles/App.css"
import "./styles/Tiles.css"
import "./styles/MobileApp.css"
import { hotkeys } from "react-keyboard-shortcuts"
import AppBar from "@material-ui/core/AppBar"
import MainBodyHeader from "./components/MainBodyHeader"
import StatusBar from "./components/devices/StatusBar"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Helmet from "react-helmet"
import queryString from "query-string"

class MainMobile extends Component {
  state = {
    drawer: false,
    showMainHidden: false,
    hiddenNotifications: false,
    slideIndex: 0,
    areSettingsOpen: false,
    searchText: "",
  }

  changeDrawerState = () => {
    if (!this.state.areSettingsOpen)
      this.setState(oldState => ({
        drawer: !oldState.drawer,
      }))
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
      handler: event => {
        if (
          this.props.userData.user.devices[0] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText === "") {
            this.props.selectDevice(this.props.userData.user.devices[0].id)
          } else {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[0].id
            )
          }
          this.setState({ drawer: false })
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 0 })
        }
      },
    },
    "alt+2": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[1] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[1].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[1].id)
          }
          this.setState({ drawer: false })
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 1 })
        }
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[2] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[2].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[2].id)
          }
          this.setState({ drawer: false })
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 2 })
        }
      },
    },
    "alt+4": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[3] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[3].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[3].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
    "alt+5": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[4] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[4].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[4].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
    "alt+6": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[5] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[5].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[5].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
    "alt+7": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[6] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[6].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[6].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
    "alt+8": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[7] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[7].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[7].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
    "alt+9": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[8] &&
          !this.state.areSettingsOpen
        ) {
          if (this.props.devicesSearchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.name
                  .toLowerCase()
                  .includes(this.props.devicesSearchText.toLowerCase())
              )[8].id
            )
          } else {
            this.props.selectDevice(this.props.userData.user.devices[8].id)
          }
          this.setState({ drawer: false })
        }
      },
    },
  }

  constructor() {
    super()

    this.state = {
      showHidden: false,
      areSettingsOpen: false,
      isTileFullScreen: false,
      drawer: false,
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
    const deviceSubscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          index
          name
          icon
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          createdAt
          updatedAt
          notificationCount
          notifications {
            id
            content
            visualized
          }
        }
      }
    `

    this.props.environmentData.subscribeToMore({
      document: deviceSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.environment.devices,
          subscriptionData.data.deviceCreated,
        ]

        return {
          environment: {
            ...prev.environment,
            devices: newDevices,
          },
        }
      },
    })

    const subscribeToDevicesUpdates = gql`
      subscription {
        deviceUpdated {
          id
          myRole
          batteryStatus
          batteryCharging
          signalStatus
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    `

    this.props.environmentData.subscribeToMore({
      document: subscribeToDevicesUpdates,
    })

    const subscribeToDevicesDeletes = gql`
      subscription {
        deviceDeleted
      }
    `

    this.props.environmentData.subscribeToMore({
      document: subscribeToDevicesDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = prev.environment.devices.filter(
          device => device.id !== subscriptionData.data.deviceDeleted
        )

        return {
          environment: {
            ...prev.environment,
            devices: newDevices,
          },
        }
      },
    })
  }

  render() {
    const {
      environmentData: { error, environment },
    } = this.props

    let nightMode = ""
    let devMode = ""

    nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    if (error) {
      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut()
      }
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>
            {environment
              ? queryString.parse("?" + window.location.href.split("?")[1])
                  .device
                ? "Igloo Aurora - " +
                  environment.devices.filter(
                    device =>
                      device.id ===
                      queryString.parse(
                        "?" + window.location.href.split("?")[1]
                      ).device
                  )[0].name
                : "Igloo Aurora - " + environment.name
              : "Igloo Aurora"}
          </title>
        </Helmet>
        <div className="mobileMain">
          {this.props.selectedDevice == null ? (
            <React.Fragment>
              <AppBar position="sticky">
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
              </AppBar>
              <div
                className="mobileSidebar"
                key="sidebar"
                style={
                  nightMode
                    ? { background: "#21252b" }
                    : { background: "white" }
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
                className="mobileMainBody"
                key="mainBody"
                style={
                  nightMode
                    ? { background: "#2f333d" }
                    : { background: "white" }
                }
              >
                <div style={{ height: "calc(100vh - 112px)" }}>
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
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      environment(id: $id) {
        id
        name
        devices {
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
          notificationCount
          notifications {
            id
            content
            visualized
          }
        }
      }
    }
  `,
  {
    name: "environmentData",
    options: ({ environmentId }) => ({ variables: { id: environmentId } }),
  }
)(hotkeys(MainMobile))
