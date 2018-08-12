import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"
import "./styles/MobileApp.css"
import { hotkeys } from "react-keyboard-shortcuts"
import AppBar from "material-ui-next/AppBar"
import SettingsDialogMobile from "./components/settings/SettingsDialogMobile"
import MainBodyHeaderMobile from "./components/MainBodyHeaderMobile"
import EmailNotVerified from "./components/EmailNotVerified"
import StatusBar from "./components/StatusBar"
import GetLinkSuccess from "./components/GetLinkSuccess"
import {Redirect} from "react-router-dom"
import { Typography } from "material-ui-next"
import polarBear from "./styles/assets/polarBear.svg"

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
            this.props.selectDevice(this.props.userData.user.devices[0].id)
          } else {
            this.props.selectDevice(
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
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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
          if (this.state.searchText !== "") {
            this.props.selectDevice(
              this.props.userData.user.devices.filter(device =>
                device.customName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
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

  handleSettingsTabChanged = value => {
    this.setState({
      slideIndex: value,
    })
  }

  handleChangeBTIndex = (event, value) => {
    this.setState({ slideIndex: value })
  }

  render() {
    const {
      userData: { user },
    } = this.props

    let nightMode = ""
    let devMode = ""
    let idList = []

    if (user) {
      nightMode = user.nightMode
      devMode = user.devMode

      idList = user.devices.map(device => device.id)
    }

    return (
      <MuiThemeProvider>
        <React.Fragment>
          <Online>
            <div className="mobileMain">
              {this.props.selectedDevice == null ? (
                <React.Fragment>
                  <SettingsDialogMobile
                    isOpen={this.state.areSettingsOpen}
                    closeSettingsDialog={() => {
                      this.setState({ areSettingsOpen: false })
                    }}
                    handleChange={this.handleSettingsTabChanged}
                    slideIndex={this.state.slideIndex}
                    handleChangeBTIndex={this.handleChangeBTIndex}
                    nightMode={nightMode}
                  />
                  <AppBar position="sticky">
                    <SidebarHeader
                      logOut={this.props.logOut}
                      key="mobileSidebarHeader"
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
                  </AppBar>
                  <div
                    className="mobileSidebar"
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
                      searchText={this.state.searchText}
                      changeText={text => this.setState({ searchText: text })}
                      isMobile={true}
                      userData={this.props.userData}
                      nightMode={nightMode}
                    />
                  </div>
                </React.Fragment>
              ) : user ? (
                idList.includes(this.props.selectedDevice) ? (
                  <React.Fragment>
                    <AppBar>
                      <MainBodyHeaderMobile
                        deviceId={this.props.selectedDevice}
                        key="mobileMainBodyHeader"
                        drawer={this.state.drawer}
                        changeDrawerState={this.changeDrawerState}
                        hiddenNotifications={this.state.hiddenNotifications}
                        showHiddenNotifications={this.showHiddenNotifications}
                        selectDevice={id => {
                          this.props.selectDevice(id)
                          this.setState({ drawer: false })
                        }}
                        nightMode={nightMode}
                        isMobile={true}
                        devMode={devMode}
                        openSnackBar={() =>
                          this.setState({ copyMessageOpen: true })
                        }
                        selectedBoard={this.props.selectedBoard}
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
                      <div style={{ height: "calc(100vh - 96px)" }}>
                        <MainBody
                          deviceId={this.props.selectedDevice}
                          showHidden={this.state.showMainHidden}
                          changeShowHiddenState={this.changeShowHiddenState}
                          isMobile={true}
                          nightMode={nightMode}
                          devMode={devMode}
                        />
                      </div>
                      <StatusBar
                        userData={this.props.userData}
                        deviceId={this.props.selectedDevice}
                        nightMode={nightMode}
                      />
                    </div>
                  </React.Fragment>
                ) : (
<Redirect
                      exact
                      to={
                        this.props.selectedBoard
                          ? "/dashboard?board=" + this.props.selectedBoard
                          : "/dashboard"
                      }
                    />                )
              ) : (
                ""
              )}
            </div>
            <EmailNotVerified mobile={true} />
            <GetLinkSuccess
              mobile={true}
              open={this.state.copyMessageOpen}
              close={() => this.setState({ copyMessageOpen: false })}
            />
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
                width: "80vw",
              }}
            >
              <Typography variant="headline" style={{ color: "white" }}>
                You are not connected, try again in a while
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
                variant="title"
                gutterBottom
                style={{ color: "white" }}
              >
                In the meantime, why don't you have a nap?
              </Typography>
            </div>
          </div>
          </Offline>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(Main)
