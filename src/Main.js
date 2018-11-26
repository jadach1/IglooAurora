import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import SettingsDialog from "./components/settings/SettingsDialog"
import "./styles/App.css"
import "./styles/Tiles.css"
import { hotkeys } from "react-keyboard-shortcuts"
import StatusBar from "./components/devices/StatusBar"
import { Redirect } from "react-router-dom"
import queryString from "query-string"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Helmet from "react-helmet"

let deviceIdList = []

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

  keyboardShortcutHandler = index => {
    const {
      boardData: { board },
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
      if (board) {
        if (this.props.boardData.board.devices[index]) {
          if (this.props.devicesSearchText === "") {
            if (
              this.props.boardData.board.devices[index].id ===
              queryString.parse("?" + window.location.href.split("?")[1]).device
            ) {
              this.setState({ deselectDevice: true })
            } else {
              this.setState({
                redirectTo: this.props.boardData.board.devices[index].id,
              })
            }
          } else {
            this.setState({
              redirectTo: this.props.boardData.board.devices.filter(device =>
                device.customName
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
      handler: () => this.keyboardShortcutHandler(0),
    },
    "alt+2": {
      priority: 1,
      handler: () => this.keyboardShortcutHandler(1),
    },
    "alt+3": {
      priority: 1,
      handler: () => this.keyboardShortcutHandler(2),
    },
    "alt+4": {
      priority: 1,
      handler: () => this.keyboardShortcutHandler(3),
      "alt+5": {
        priority: 1,
        handler: () => this.keyboardShortcutHandler(4),
      },
      "alt+6": {
        priority: 1,
        handler: () => this.keyboardShortcutHandler(5),
      },
      "alt+7": {
        priority: 1,
        handler: () => this.keyboardShortcutHandler(6),
      },
      "alt+8": {
        priority: 1,
        handler: () => this.keyboardShortcutHandler(7),
      },
      "alt+9": {
        priority: 1,
        handler: () => this.keyboardShortcutHandler(8),
      },
    },
  }

  constructor() {
    super()

    this.state = {
      showHidden: false,
      isTileFullScreen: false,
      drawer: false,
      copyMessageOpen: false,
      deselectDevice: false,
      slideIndex:0
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
          customName
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

    this.props.boardData.subscribeToMore({
      document: deviceSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.board.devices,
          subscriptionData.data.deviceCreated,
        ]

        return {
          board: {
            ...prev.board,
            devices: newDevices,
          },
        }
      },
    })

    const subscribeToDevicesUpdates = gql`
      subscription {
        deviceUpdated {
          id
          index
          customName
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

    this.props.boardData.subscribeToMore({
      document: subscribeToDevicesUpdates,
    })

    const subscribeToDevicesDeletes = gql`
      subscription {
        deviceDeleted
      }
    `

    this.props.boardData.subscribeToMore({
      document: subscribeToDevicesDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = prev.board.devices.filter(
          device => device.id !== subscriptionData.data.deviceDeleted
        )

        return {
          board: {
            ...prev.board,
            devices: newDevices,
          },
        }
      },
    })
  }

  render() {
    const {
      boardData: { board },
    } = this.props

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

    if (this.props.boards) {
      let boardIdList = this.props.boards.map(board => board.id)

      if (!queryString.parse("?" + window.location.href.split("?")[1]).device) {
        if (!boardIdList.includes(this.props.boardId))
          return <Redirect exact to="/dashboard" />
      }

      let j

      for (j = 0; j < this.props.boards.length; j++) {
        deviceIdList = deviceIdList.concat(
          this.props.boards[j].devices.map(device => device.id)
        )
      }
    }

    if (board) {
      let i

      for (i = 0; i < board.devices.length; i++) {
        if (
          board.devices[i].id ===
            queryString.parse("?" + window.location.href.split("?")[1])
              .device &&
          board.id !==
            queryString.parse("?" + window.location.href.split("?")[1]).board
        ) {
          return (
            <Redirect
              to={
                "/dashboard?board=" +
                board.devices[i].board.id +
                "&device=" +
                board.devices[i].id
              }
            />
          )
        }
      }
    }

    let handleSettingsTabChanged = (event, value) => {
      this.setState({
        slideIndex: value,
      })
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {board &&
            board.devices.filter(
              device =>
                device.id ===
                queryString.parse("?" + window.location.href.split("?")[1])
                  .device
            )[0]
              ? queryString.parse("?" + window.location.href.split("?")[1])
                  .device
                ? "Igloo Aurora - " +
                  board.devices.filter(
                    device =>
                      device.id ===
                      queryString.parse(
                        "?" + window.location.href.split("?")[1]
                      ).device
                  )[0].customName
                : "Igloo Aurora - " + board.customName
              : "Igloo Aurora"}
          </title>
        </Helmet>
        <div className="main">
          <SettingsDialog
            isOpen={this.props.areSettingsOpen}
            closeSettingsDialog={this.props.closeSettings}
            handleChange={handleSettingsTabChanged}
            slideIndex={this.state.slideIndex}
            nightMode={nightMode}
            userData={this.props.userData}
            logOut={this.props.logOut}
            forceUpdate={this.props.forceUpdate}
            handleSwipe={index => {
              this.setState({ slideIndex: index })
            }}
          />
          <div className="invisibleHeader" key="invisibleHeader" />
          <SidebarHeader
            logOut={this.props.logOut}
            key="sidebarHeader"
            selectedBoard={this.props.boardId}
            areSettingsOpen={this.props.areSettingsOpen}
            openSettingsDialog={this.props.openSettings}
            closeSettings={this.props.closeSettings}
            changeSettingsState={() =>
              this.setState(oldState => ({
                areSettingsOpen: !oldState.areSettingsOpen,
                drawer: false,
              }))
            }
            boards={this.props.boards}
          />
          <div
            className="sidebar"
            key="sidebar"
            style={
              nightMode ? { background: "#21252b" } : { background: "#f2f2f2" }
            }
          >
            <Sidebar
              selectDevice={id => {
                this.props.selectDevice(id)
                this.setState({ drawer: false })
              }}
              selectedDevice={this.props.selectedDevice}
              changeDrawerState={this.changeDrawerState}
              boardData={this.props.boardData}
              nightMode={nightMode}
              selectedBoard={this.props.boardId}
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
              boardData={this.props.boardData}
              boards={this.props.boards}
            />
          ) : (
            <div className="mainBodyHeader" key="mainBodyHeader" />
          )}
          {this.props.selectedDevice !== null ? (
            <React.Fragment>
              <MainBody
                deviceId={this.props.selectedDevice}
                showHidden={this.state.showMainHidden}
                changeShowHiddenState={this.changeShowHiddenState}
                nightMode={nightMode}
                devMode={devMode}
                boardData={this.props.boardData}
                isMobile={false}
                boards={this.props.boards}
              />
              <StatusBar
                boardData={this.props.boardData}
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
        {this.state.redirectTo && board && (
          <Redirect
            push
            to={
              "/dashboard?board=" +
              board.id +
              "&device=" +
              this.state.redirectTo
            }
          />
        )}
        {this.state.deselectDevice && board && (
          <Redirect push to={"/dashboard?board=" + board.id} />
        )}
        {board &&
          this.props.boards &&
          !deviceIdList.includes(this.props.selectedDevice) && (
            <Redirect
              exact
              to={
                this.props.boardId
                  ? "/dashboard?board=" + this.props.boardId
                  : "/dashboard"
              }
            />
          )}
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      board(id: $id) {
        id
        customName
        devices {
          id
          index
          customName
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
    }
  `,
  {
    name: "boardData",
    options: ({ boardId }) => ({ variables: { id: boardId } }),
  }
)(hotkeys(Main))
