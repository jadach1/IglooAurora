import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SettingsDialog from "./components/settings/SettingsDialog"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"
import { hotkeys } from "react-keyboard-shortcuts"
import NotificationsSnackbar from "./components/NotificationsSnackbar"
import StatusBar from "./components/StatusBar"

class Main extends Component {
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
          if (this.state.searchText === "") {
            this.selectDevice(this.props.userData.user.devices[0].id)
          } else {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[1].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[1].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[2].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[2].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[3].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[3].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[4].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[4].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[5].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[5].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[6].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[6].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[7].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[7].id)
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
          if (this.state.searchText !== "") {
            this.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )[8].id
            )
          } else {
            this.selectDevice(this.props.userData.user.devices[8].id)
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
      selectedDevice: null,
      areSettingsOpen: false,
      isTileFullScreen: false,
      drawer: false,
      nightMode: false,
    }
  }

  selectDevice = id => this.setState({ selectedDevice: id, drawer: false })

  changeShowHiddenState = () =>
    this.setState(oldState => ({
      showMainHidden: !oldState.showMainHidden,
    }))

  showHiddenNotifications = () =>
    this.setState(oldState => ({
      hiddenNotifications: !oldState.hiddenNotifications,
    }))

  handleSettingsTabChanged = value => {
    this.setState({
      slideIndex: value,
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <Online>
            <div className="main">
              <SettingsDialog
                isOpen={this.state.areSettingsOpen}
                closeSettingsDialog={() => {
                  this.setState({ areSettingsOpen: false })
                }}
                handleChange={this.handleSettingsTabChanged}
                slideIndex={this.state.slideIndex}
                nightMode={this.state.nightMode}
              />
              <div className="invisibleHeader" key="invisibleHeader" />
              <SidebarHeader
                logOut={this.props.logOut}
                key="sidebarHeader"
                openSettingsDialog={() => {
                  this.setState({ areSettingsOpen: true })
                }}
                changeSettingsState={() =>
                  this.setState(oldState => ({
                    areSettingsOpen: !oldState.areSettingsOpen,
                    drawer: false,
                  }))
                }
              />
              <div
                className="sidebar"
                key="sidebar"
                style={
                  this.state.nightMode
                    ? { background: "#21252b" }
                    : { background: "#f2f2f2" }
                }
              >
                <Sidebar
                  selectDevice={id => this.setState({ selectedDevice: id })}
                  selectedDevice={this.state.selectedDevice}
                  changeDrawerState={this.changeDrawerState}
                  searchText={this.state.searchText}
                  changeText={text => this.setState({ searchText: text })}
                  userData={this.props.userData}
                  nightMode={this.state.nightMode}
                />
              </div>
              {this.state.selectedDevice !== null ? (
                <MainBodyHeader
                  deviceId={this.state.selectedDevice}
                  key="mainBodyHeader"
                  drawer={this.state.drawer}
                  changeDrawerState={this.changeDrawerState}
                  hiddenNotifications={this.state.hiddenNotifications}
                  showHiddenNotifications={this.showHiddenNotifications}
                  nightMode={this.state.nightMode}
                />
              ) : (
                <div className="mainBodyHeader" key="mainBodyHeader" />
              )}
              {this.state.selectedDevice !== null ? (
                <React.Fragment>
                  <MainBody
                    deviceId={this.state.selectedDevice}
                    showHidden={this.state.showMainHidden}
                    changeShowHiddenState={this.changeShowHiddenState}
                    nightMode={this.state.nightMode}
                  />
                  <StatusBar
                    userData={this.props.userData}
                    deviceId={this.state.selectedDevice}
                    nightMode={this.state.nightMode}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div
                    className="mainBody"
                    style={
                      this.state.nightMode
                        ? { background: "#2f333d" }
                        : { background: "white" }
                    }
                  />
                  <div
                    className="statusBar"
                    style={
                      this.state.nightMode
                        ? { background: "#2f333d" }
                        : { background: "white" }
                    }
                  />
                </React.Fragment>
              )}
            </div>
            <NotificationsSnackbar />
          </Online>
          <Offline key="offlineMainBody">
            <div className="main notSelectable" style={{ cursor: "default" }}>
              <div className="invisibleHeader" key="invisibleHeader" />
              <SidebarHeader logOut={this.props.logOut} key="sidebarHeader" />
              <div className="sidebar" key="sidebar" />
              <div className="mainBodyHeader" key="mainBodyHeader" />
              <div className="offlineBody mainBody">
                <font size="6">
                  You are not connected, try again in a while
                </font>
                <br />
                <br />

                <font size="5">In the meantime, why don't you have a nap?</font>
                <br />
                <img
                  alt="Sleeping Polar Bear"
                  src="./assets/polarBear.svg"
                  width="400"
                  height="400"
                  className="logo notSelectable"
                />
              </div>
            </div>
          </Offline>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(Main)
