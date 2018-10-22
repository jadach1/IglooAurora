import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import SettingsDialog from "./components/settings/SettingsDialog"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"
import { hotkeys } from "react-keyboard-shortcuts"
import StatusBar from "./components/devices/StatusBar"
import { Redirect } from "react-router-dom"
import Typography from "@material-ui/core/Typography"
import polarBear from "./styles/assets/polarBear.svg"
import queryString from "query-string"

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
        const {
          userData: { user },
        } = this.props

        if (user) {
          if (
            this.props.userData.user.devices[0] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText === "") {
              this.props.selectDevice(this.props.userData.user.devices[0].id)
            } else {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
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
        }
      },
    },
    "alt+2": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[1] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
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
        }
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[2] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
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
        }
      },
    },
    "alt+4": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[3] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[3].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[3].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+5": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[4] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[4].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[4].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+6": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[5] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[5].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[5].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+7": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[6] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[6].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[6].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+8": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[7] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[7].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[7].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+9": {
      priority: 1,
      handler: event => {
        if (this.props.userData.user) {
          if (
            this.props.userData.user.devices[8] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.userData.user.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[8].id
              )
            } else {
              this.props.selectDevice(this.props.userData.user.devices[8].id)
            }
            this.setState({ drawer: false })
          }
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
      copyMessageOpen: false,
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

  render() {
    const {
      userData: { user },
    } = this.props

    let nightMode = false
    let devMode = false
    let deviceIdList = []

    if (user) {
      nightMode = typeof Storage !== "undefined" && localStorage.getItem("nightMode")==="true"
      devMode = user.devMode

      deviceIdList = user.devices.map(device => device.id)

      let boardIdList = user.boards.map(board => board.id)

      if (!queryString.parse("?" + window.location.href.split("?")[1]).device) {
        if (!boardIdList.includes(this.props.selectedBoard))
          return <Redirect exact to="/dashboard" />
      }
    }

    let handleSettingsTabChanged = value => {
      this.setState({
        slideIndex: value,
      })
    }

    return (
      <React.Fragment>
        <Online>
          <div className="main">
            <SettingsDialog
              isOpen={this.props.areSettingsOpen}
              closeSettingsDialog={this.props.closeSettings}
              handleChange={handleSettingsTabChanged}
              slideIndex={this.state.slideIndex}
              nightMode={nightMode}
              userData={this.props.userData}
            />
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader
              logOut={this.props.logOut}
              key="sidebarHeader"
              selectedBoard={this.props.selectedBoard}
              openSettingsDialog={this.props.openSettings}
              changeSettingsState={() =>
                this.setState(oldState => ({
                  areSettingsOpen: !oldState.areSettingsOpen,
                  drawer: false,
                }))
              }
              user={this.props.userData.user}
              boardName={
                this.props.userData.user &&
                this.props.userData.user.boards.filter(
                  board => board.id === this.props.selectedBoard
                )[0].customName
              }
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
                userData={this.props.userData}
                nightMode={nightMode}
                selectedBoard={this.props.selectedBoard}
                searchDevices={this.props.searchDevices}
                searchText={this.props.devicesSearchText}
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
                userData={this.props.userData}
              />
            ) : (
                <div className="mainBodyHeader" key="mainBodyHeader" />
              )}
            {this.props.selectedDevice !== null ? (
              user ? (
                deviceIdList.includes(this.props.selectedDevice) ? (
                  <React.Fragment>
                    <MainBody
                      deviceId={this.props.selectedDevice}
                      showHidden={this.state.showMainHidden}
                      changeShowHiddenState={this.changeShowHiddenState}
                      nightMode={nightMode}
                      devMode={devMode}
                      userData={this.props.userData}
                    />
                    <StatusBar
                      userData={this.props.userData}
                      deviceId={this.props.selectedDevice}
                      nightMode={nightMode}
                    />
                  </React.Fragment>
                ) : (
                    <Redirect
                      exact
                      to={
                        this.props.selectedBoard
                          ? "/dashboard?board=" + this.props.selectedBoard
                          : "/dashboard"
                      }
                    />
                  )
              ) : (
                  ""
                )
            ) : (
                <React.Fragment>
                  <div
                    style={
                      nightMode
                        ? { background: "#2f333d" }
                        : { background: "white" }
                    }
                    className="mainBody"
                  >
                    <div
                      className={nightMode ? "darkMainBodyBG" : "mainBodyBG"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div
                    className="statusBar"
                    style={
                      nightMode
                        ? { background: "#2f333d" }
                        : { background: "white" }
                    }
                  />
                </React.Fragment>
              )}
          </div>
        </Online>
        <Offline key="offlineMainBody">
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "#0057cb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                width: "400px",
              }}
            >
              <Typography variant="display1" style={{ color: "white" }}>
                You are not connected,
                <br />
                try again in a while
              </Typography>
              <br />
              <br />
              <br />
              <br />
              <img
                alt="Sleeping Polar Bear"
                src={polarBear}
                className="notSelectable"
              />
              <br />
              <br />
              <br />
              <br />
              <Typography
                variant="headline"
                gutterBottom
                style={{ color: "white" }}
              >
                In the meantime,
                <br />
                why don't you have a nap?
              </Typography>
            </div>
          </div>
        </Offline>
      </React.Fragment>
    )
  }
}

export default hotkeys(Main)
