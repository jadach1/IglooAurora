import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Slide from "@material-ui/core/Slide"
import Grow from "@material-ui/core/Grow"
import Icon from "@material-ui/core/Icon"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Switch from "@material-ui/core/Switch"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListSubheader from "@material-ui/core/ListSubheader"
import Divider from "@material-ui/core/Divider"
import SwipeableViews from "react-swipeable-views"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ChangeNameDialog from "./ChangeName"
// import TwoFactorDialog from "./Enable2FA"
import DeleteAccountDialog from "./DeleteAccount"
// import ManageEmailDialog from "./ManageEmail"
import ChangePasswordDialog from "./ChangePassword"
//import ChangeLanguageDialog from "./ChangeLanguage"
import TimeFormatDialog from "./TimeFormat"
// import TimeZoneDialog from "./TimeZone"
import UnitOfMeasumentDialog from "./UnitOfMeasurement"
import ManageAuthorizations from "./ManageAuthorizations"
import Shortcuts from "./Shortcuts"
import CreateValue from "./CreateValue"
import CreateDevice from "./CreateDevice"
import CreateNotification from "./CreateNotification"
import CreatePlotNode from "./CreatePlotNode"
import GDPRDataDownload from "./GDPRDataDownload"
import ChangeEmail from "./ChangeEmail"
import ChangeServer from "./ChangeServer"
import VerifyEmailDialog from "../VerifyEmailDialog"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import Toolbar from "@material-ui/core/Toolbar"
import Translate from "translate-components"
// var moment = require("moment-timezone")

let allDevices = []

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

const allDialogsClosed = {
  deleteDialogOpen: false,
  passwordDialogOpen: false,
  emailDialogOpen: false,
  deleteConfirmedDialogOpen: false,
  twoFactorDialogOpen: false,
  languageDialogOpen: false,
  timeZoneDialogOpen: false,
  timeFormatDialogOpen: false,
  unitDialogOpen: false,
  nameDialogOpen: false,
  shortcutDialogOpen: false,
  authDialogOpen: false,
  createValueOpen: false,
  createDeviceOpen: false,
  createNotificationOpen: false,
  createNodeOpen: false,
  gdprOpen: false,
  serverOpen: false,
  verifyOpen: false,
}

class SettingsDialog extends React.Component {
  state = {
    isDeleteDisabled: true,
    timer: 5,
    stepIndex: 0,
    showHidden: false,
    ...allDialogsClosed,
  }

  handleTwoFactorDialogOpen = () => {
    this.setState({ twoFactorDialogOpen: true })
  }

  handleTwoFactorDialogClose = () => {
    this.setState({ twoFactorDialogOpen: false })
  }

  handleEmailDialogOpen = () => {
    this.setState({ emailDialogOpen: true })
  }

  handleEmailDialogClose = () => {
    this.setState({ emailDialogOpen: false })
  }

  handleAuthDialogOpen = () => {
    this.setState({ authDialogOpen: true })
  }

  handleAuthDialogClose = () => {
    this.setState({ authDialogOpen: false })
  }

  handleShortcutDialogOpen = () => {
    this.setState({ shortcutDialogOpen: true })
  }

  handleShortcutDialogClose = () => {
    this.setState({ shortcutDialogOpen: false })
  }

  handleDeleteDialogOpen = () => {
    this.setState({
      deleteDialogOpen: true,
      isDeleteDisabled: true,
      timer: 5,
    })
  }

  deleteConfirmed = () => {
    this.handleDeleteDialogClose()
    this.handleDeleteConfirmedOpen()
    setTimeout(this.secondsTimer, 1000)
  }

  handleDeleteConfirmedOpen = () => {
    this.setState({ deleteConfirmedDialogOpen: true })
  }

  handlePasswordDialogOpen = () => {
    this.setState({ passwordDialogOpen: true })
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false })
  }

  handlePasswordDialogClose = () => {
    this.setState({ passwordDialogOpen: false })
  }

  handleDeleteConfirmedClose = () => {
    this.setState({ deleteConfirmedDialogOpen: false })
  }

  handleLanguageDialogOpen = () => {
    this.setState({ languageDialogOpen: true })
  }

  handleLanguageDialogClose = () => {
    this.setState({ languageDialogOpen: false })
  }

  handleTimeDialogOpen = () => {
    this.setState({ timeZoneDialogOpen: true })
  }

  handleTimeDialogClose = () => {
    this.setState({ timeZoneDialogOpen: false })
  }

  handleTimeFormatDialogOpen = () => {
    this.setState({ timeFormatDialogOpen: true })
  }

  handleTimeFormatDialogClose = () => {
    this.setState({ timeFormatDialogOpen: false })
  }

  handleUnitDialogOpen = () => {
    this.setState({ unitDialogOpen: true })
  }

  handleUnitDialogClose = () => {
    this.setState({ unitDialogOpen: false })
  }

  handleNameDialogOpen = () => {
    this.setState({ nameDialogOpen: true })
  }

  handleNameDialogClose = () => {
    this.setState({ nameDialogOpen: false })
  }

  secondsTimer = () => {
    this.setState(({ timer }) => {
      if (timer > 1 && this.state.deleteConfirmedDialogOpen) {
        setTimeout(this.secondsTimer, 1000)
      }

      return {
        timer: timer - 1 || 5,
        isDeleteDisabled: timer > 1,
      }
    })
  }

  // TODO: update react to next version and change this to getDerivedStateFromProps
  componentWillReceiveProps(nextProps) {
    this.setState(allDialogsClosed)
  }

  updateDimensions() {
    if (window.innerWidth > MOBILE_WIDTH) {
      this.setState({ isDesktop: true })
    } else {
      this.setState({ isDesktop: false })
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
      userData: { user },
    } = this.props

    let toggleNightMode = () => {
      if (typeof Storage !== "undefined") {
        !localStorage.getItem("nightMode") &&
          localStorage.setItem("nightMode", "false")

        localStorage.setItem(
          "nightMode",
          !(localStorage.getItem("nightMode") === "true")
        )

        this.props.forceUpdate()
      }
    }

    let toggleDevMode = () => {
      if (typeof Storage !== "undefined") {
        !localStorage.getItem("devMode") &&
          localStorage.setItem("devMode", "false")

        localStorage.setItem(
          "devMode",
          !(localStorage.getItem("devMode") === "true")
        )
        this.props.forceUpdate()
      }
    }

    let toggleQuietMode = () => {}

    // let languageText = "English"

    let fullName = ""

    let profileIconColor = ""

    if (user) {
      if (user.boards) {
        allDevices = []

        for (let i = 0; i < user.boards.length; i++) {
          for (let j = 0; j < user.boards[i].devices.length; j++) {
            allDevices.push(user.boards[i].devices[j])
          }
        }
      }

      toggleQuietMode = quietMode => {
        this.props["ToggleQuietMode"]({
          variables: {
            quietMode: quietMode,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              quietMode: quietMode,
              __typename: "User",
            },
          },
        })
      }

      /*       switch (user.language) {
        case "en":
          languageText = "English"
          break
        case "de":
          languageText = "Deutsch"
          break
        case "es":
          languageText = "Español"
          break
        case "it":
          languageText = "Italiano"
          break
        case "zh-Hans":
          languageText = "中文(简体)"
          break
        default:
          languageText = "English"
          break
      } */

      fullName = user.fullName

      profileIconColor = user.profileIconColor
    }

    let uiSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? this.state.isDesktop
              ? {
                  overflowY: "auto",
                  height: "calc(100vh - 220px)",
                  maxHeight: "550px",
                  background: "#2f333d",
                }
              : {
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                  background: "#2f333d",
                }
            : this.state.isDesktop
            ? {
                overflowY: "auto",
                height: "calc(100vh - 220px)",
                maxHeight: "550px",
              }
            : {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
              }
        }
      >
        <div style={listStyles.root}>
          <List style={{ width: "100%", padding: "0" }}>
            <ListSubheader
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "#c1c2c5",
                      cursor: "default",
                      backgroundColor: "#2f333d",
                    }
                  : {
                      color: "#7a7a7a",
                      cursor: "default",
                      backgroundColor: "white",
                    }
              }
            >
              Appearance
            </ListSubheader>
            <ListItem
              disabled={typeof Storage === "undefined"}
              button
              disableRipple
              onClick={toggleNightMode}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Night mode
                  </font>
                }
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={localStorage.getItem("nightMode") === "true"}
                  onChange={toggleNightMode}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListSubheader
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "#c1c2c5",
                      cursor: "default",
                      backgroundColor: "#2f333d",
                    }
                  : {
                      color: "#7a7a7a",
                      cursor: "default",
                      backgroundColor: "white",
                    }
              }
            >
              Notifications
            </ListSubheader>
            <ListItem
              disabled={!user}
              button
              disableRipple
              onClick={() => {
                user.quietMode ? toggleQuietMode(false) : toggleQuietMode(true)
              }}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Quiet mode
                  </font>
                }
                secondary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "#c1c2c5" }
                        : { color: "#7a7a7a" }
                    }
                  >
                    Mute all notifications
                  </font>
                }
              />
              <ListItemSecondaryAction>
                <Switch
                  disabled={!user}
                  checked={user && user.quietMode}
                  onChange={() => {
                    user.quietMode
                      ? toggleQuietMode(false)
                      : toggleQuietMode(true)
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListSubheader
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "#c1c2c5",
                      cursor: "default",
                      backgroundColor: "#2f333d",
                    }
                  : {
                      color: "#7a7a7a",
                      cursor: "default",
                      backgroundColor: "white",
                    }
              }
            >
              Localization
            </ListSubheader>
            {/*
  <ListItem
    primaryText="Change language"
    secondaryText={languageText}
    onClick={this.handleLanguageDialogOpen}
  /> */}
            <ListItem
              disabled={!user}
              button
              onClick={this.handleUnitDialogOpen}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Change units of measurement
                  </font>
                }
                secondary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "#c1c2c5" }
                        : { color: "#7a7a7a" }
                    }
                  >
                    SI, Celsius
                  </font>
                }
              />
            </ListItem>
            {/*     <Divider />
  <ListSubheader style={{ cursor: "default" }}>Time</ListSubheader>
<ListItem
    primaryText="Change time zone"
    secondaryText={
      "Auto: (UTC" +
      moment.tz(moment.tz.guess()).format("Z") +
      ") " +
      moment.tz.guess().split("/")[1]
    }
    onClick={this.handleTimeDialogOpen}
  /> */}
            <ListItem
              disabled={!user}
              button
              onClick={this.handleTimeFormatDialogOpen}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Change date and time format
                  </font>
                }
                secondary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "#c1c2c5" }
                        : { color: "#7a7a7a" }
                    }
                  >
                    DD/MM/YYYY, 24-hour clock
                  </font>
                }
              />
            </ListItem>
            <Divider />
            <ListSubheader
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "#c1c2c5",
                      cursor: "default",
                      backgroundColor: "#2f333d",
                    }
                  : {
                      color: "#7a7a7a",
                      cursor: "default",
                      backgroundColor: "white",
                    }
              }
            >
              Miscellaneous
            </ListSubheader>
            <ListItem button>
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Add to home screen
                  </font>
                }
              />
            </ListItem>
            <ListItem button onClick={this.handleShortcutDialogOpen}>
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Keyboard shortcuts
                  </font>
                }
              />
            </ListItem>
            <ListItem
              disabled={typeof Storage === "undefined"}
              button
              disableRipple
              onClick={() => {
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
                  ? toggleDevMode(false)
                  : toggleDevMode(true)
              }}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Developer mode
                  </font>
                }
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("devMode") === "true"
                  }
                  onChange={() => {
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("devMode") === "true"
                      ? toggleDevMode(false)
                      : toggleDevMode(true)
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </div>
    )

    let accountSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? this.state.isDesktop
              ? {
                  overflowY: "auto",
                  height: "calc(100vh - 220px)",
                  maxHeight: "550px",
                  background: "#2f333d",
                }
              : {
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                  background: "#2f333d",
                }
            : this.state.isDesktop
            ? {
                overflowY: "auto",
                height: "calc(100vh - 220px)",
                maxHeight: "550px",
              }
            : {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
              }
        }
      >
        <List style={{ padding: "0" }}>
          <ListSubheader
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "#c1c2c5",
                    cursor: "default",
                    backgroundColor: "#2f333d",
                  }
                : {
                    color: "#7a7a7a",
                    cursor: "default",
                    backgroundColor: "white",
                  }
            }
          >
            Authentication
          </ListSubheader>
          {/* <ListItem
primaryText="Manage emails"
secondaryText="Add or delete emails you use to log in"
onClick={this.handleEmailDialogOpen}
/> */}
          <ListItem
            disabled={!user}
            button
            onClick={() => this.setState({ emailDialogOpen: true })}
          >
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Change email
                </font>
              }
            />
          </ListItem>
          <ListItem
            disabled={!user}
            button
            onClick={this.handlePasswordDialogOpen}
          >
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Change password
                </font>
              }
            />
          </ListItem>
          <ListItem
            disabled={typeof Storage === "undefined"}
            button
            disableRipple
            onClick={() => {
              localStorage.setItem(
                "keepLoggedIn",
                localStorage.getItem("keepLoggedIn") !== "true"
              )
              this.forceUpdate()
              if (localStorage.getItem("keepLoggedIn") === "true") {
                localStorage.setItem("bearer", sessionStorage.getItem("bearer"))
                sessionStorage.setItem("bearer", "")
              } else {
                sessionStorage.setItem("bearer", localStorage.getItem("bearer"))
                localStorage.setItem("bearer", "")
              }
            }}
          >
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Log out at the end of every session
                </font>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("keepLoggedIn") === "true"
                }
                onChange={() => {
                  localStorage.setItem(
                    "keepLoggedIn",
                    localStorage.getItem("keepLoggedIn") !== "true"
                  )
                  this.forceUpdate()
                  if (localStorage.getItem("keepLoggedIn") === "true") {
                    localStorage.setItem(
                      "bearer",
                      sessionStorage.getItem("bearer")
                    )
                    sessionStorage.setItem("bearer", "")
                  } else {
                    sessionStorage.setItem(
                      "bearer",
                      localStorage.getItem("bearer")
                    )
                    localStorage.setItem("bearer", "")
                  }
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          {/*       <ListItem
primaryText="Two-factor authentication"
secondaryText="Make your account safer by verifying it is actually you"
rightToggle={
<Toggle
  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
  rippleStyle={{ color: "#0083ff" }}
  onToggle={this.handleTwoFactorDialogOpen}
/>
}
/>
<ListItem
primaryText="Passwordless authentication"
secondaryText="Use your fingerprint, your face or an external device to log in"
rightToggle={
<Toggle
  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
  rippleStyle={{ color: "#0083ff" }}
  onToggle={this.handleTwoFactorDialogOpen}
/>
}
/> */}
          <Divider />
          <ListSubheader
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "#c1c2c5",
                    cursor: "default",
                    backgroundColor: "#2f333d",
                  }
                : {
                    color: "#7a7a7a",
                    cursor: "default",
                    backgroundColor: "white",
                  }
            }
          >
            Account management
          </ListSubheader>
          {user && !user.emailIsVerified && (
            <ListItem
              disabled={!user}
              button
              onClick={() => this.setState({ verifyOpen: true })}
            >
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Resend verifcation email
                  </font>
                }
              />
            </ListItem>
          )}
          <ListItem disabled={!user} button onClick={this.handleNameDialogOpen}>
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Manage your profile
                </font>
              }
              secondary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5", cursor: "default" }
                      : { color: "#7a7a7a", cursor: "default" }
                  }
                >
                  Change your profile photo and name
                </font>
              }
            />
          </ListItem>
          <ListItem
            disabled={!user}
            button
            onClick={() => this.setState({ gdprOpen: true })}
          >
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Download data
                </font>
              }
              secondary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5", cursor: "default" }
                      : { color: "#7a7a7a", cursor: "default" }
                  }
                >
                  Transfer your data to another service
                </font>
              }
            />
          </ListItem>
          <ListItem
            disabled={!user}
            button
            onClick={this.handleDeleteDialogOpen}
          >
            <ListItemText
              primary={
                <span style={{ color: "#f44336" }}>Delete your account</span>
              }
            />
          </ListItem>
        </List>
      </div>
    )

    let settingsContent =
      typeof Storage !== "undefined" &&
      localStorage.getItem("devMode") === "true" ? (
        <SwipeableViews
          index={this.props.slideIndex}
          onChangeIndex={this.props.handleChange}
          style={{ overflowY: "hidden" }}
        >
          {uiSettings}
          {accountSettings}
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? this.state.isDesktop
                  ? {
                      overflowY: "auto",
                      height: "calc(100vh - 220px)",
                      maxHeight: "550px",
                      background: "#2f333d",
                    }
                  : {
                      overflowY: "auto",
                      height: "calc(100vh - 128px)",
                      background: "#2f333d",
                    }
                : this.state.isDesktop
                ? {
                    overflowY: "auto",
                    height: "calc(100vh - 220px)",
                    maxHeight: "550px",
                  }
                : {
                    overflowY: "auto",
                    height: "calc(100vh - 128px)",
                  }
            }
          >
            <List style={{ padding: "0" }}>
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        color: "#c1c2c5",
                        cursor: "default",
                        backgroundColor: "#2f333d",
                      }
                    : {
                        color: "#7a7a7a",
                        cursor: "default",
                        backgroundColor: "white",
                      }
                }
              >
                Tokens
              </ListSubheader>
              <ListItem
                disabled={!user}
                button
                onClick={this.handleAuthDialogOpen}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Manage authorizations
                    </font>
                  }
                  secondary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "#c1c2c5", cursor: "default" }
                          : { color: "#7a7a7a", cursor: "default" }
                      }
                    >
                      Generate, view and delete your accounts access tokens
                    </font>
                  }
                />
              </ListItem>
              <Divider />
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        color: "#c1c2c5",
                        cursor: "default",
                        backgroundColor: "#2f333d",
                      }
                    : {
                        color: "#7a7a7a",
                        cursor: "default",
                        backgroundColor: "white",
                      }
                }
              >
                Devices and values
              </ListSubheader>
              <ListItem
                disabled={
                  !(
                    user &&
                    user.boards.filter(board => board.myRole !== "SPECTATOR")[0]
                  )
                }
                button
                onClick={() => this.setState({ createDeviceOpen: true })}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Create a new device
                    </font>
                  }
                />
              </ListItem>
              <ListItem
                disabled={
                  !(
                    allDevices &&
                    allDevices.filter(
                      device =>
                        device.board && device.board.myRole !== "SPECTATOR"
                    )[0]
                  )
                }
                button
                onClick={() => this.setState({ createValueOpen: true })}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Create a new value
                    </font>
                  }
                />
              </ListItem>
              <ListItem
                disabled={!user}
                button
                onClick={() => this.setState({ createNodeOpen: true })}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Create a new plot node
                    </font>
                  }
                />
              </ListItem>
              <ListItem
                disabled={!user}
                button
                onClick={() => this.setState({ createNotificationOpen: true })}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Create a new notification
                    </font>
                  }
                />
              </ListItem>
              <Divider />
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        color: "#c1c2c5",
                        cursor: "default",
                        backgroundColor: "#2f333d",
                      }
                    : {
                        color: "#7a7a7a",
                        cursor: "default",
                        backgroundColor: "white",
                      }
                }
              >
                Testing
              </ListSubheader>
              <ListItem
                button
                onClick={() => this.setState({ serverOpen: true })}
              >
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Change connected server
                    </font>
                  }
                />
              </ListItem>
            </List>
          </div>
        </SwipeableViews>
      ) : (
        <SwipeableViews
          index={this.props.slideIndex}
          onChangeIndex={this.props.handleChange}
        >
          {uiSettings}
          {accountSettings}
        </SwipeableViews>
      )

    return (
      <React.Fragment>
        {this.state.isDesktop ? (
          <Dialog
            open={this.props.isOpen}
            onClose={this.props.closeSettingsDialog}
            TransitionComponent={Transition}
            className="notSelectable defaultCursor"
          >
            <DialogTitle style={{ padding: "0" }}>
              <AppBar position="sticky">
                <Tabs
                  inkBarStyle={{
                    background: "#ff4081",
                    height: "3px",
                    marginTop: "-3px",
                  }}
                  onChange={this.props.handleChange}
                  value={this.props.slideIndex}
                >
                  <Tab
                    icon={<Icon>language</Icon>}
                    label="General"
                    buttonStyle={{ backgroundColor: "#0057cb" }}
                    value={0}
                  />
                  <Tab
                    icon={<Icon>account_box</Icon>}
                    label="Account"
                    buttonStyle={{ backgroundColor: "#0057cb" }}
                    value={1}
                  />
                  {typeof Storage !== "undefined" &&
                    localStorage.getItem("devMode") === "true" && (
                      <Tab
                        icon={<Icon>code</Icon>}
                        label="Development"
                        buttonStyle={{ backgroundColor: "#0057cb" }}
                        value={2}
                      />
                    )}
                </Tabs>
              </AppBar>
            </DialogTitle>
            {settingsContent}
            <DialogActions
              className="notSelectable defaultCursor"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      padding: "8px",
                      margin: "0",
                      background: "#2f333d",
                    }
                  : {
                      padding: "8px",
                      margin: "0",
                    }
              }
            >
              <Button
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { float: "right", color: "white" }
                    : { float: "right", color: "black" }
                }
                onClick={this.props.closeSettingsDialog}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            open={this.props.isOpen}
            onClose={this.props.closeSettingsDialog}
            className="notSelectable"
            fullScreen
            TransitionComponent={Transition}
          >
            <AppBar position="sticky" style={{ height: "64px" }}>
              <Toolbar
                style={{
                  height: "64px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                }}
              >
                <Typography
                  variant="h6"
                  color="inherit"
                  className="defaultCursor"
                  style={{
                    marginLeft: "-8px",
                  }}
                >
                  <Translate>Settings</Translate>
                </Typography>
                <Tooltip id="tooltip-bottom" title="Close" placement="bottom">
                  <IconButton
                    color="primary"
                    onClick={this.props.closeSettingsDialog}
                    style={{
                      marginRight: "-16px",
                      marginLeft: "auto",
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>

            {settingsContent}
            <AppBar
              color="default"
              position="static"
              style={{ marginBottom: "0px", marginTop: "auto", height: "64px" }}
            >
              <BottomNavigation
                onChange={this.props.handleChangeBTIndex}
                value={this.props.slideIndex}
                showLabels
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        height: "64px",
                        backgroundColor: "#2f333d",
                      }
                    : {
                        height: "64px",
                        backgroundColor: "#fff",
                      }
                }
              >
                <BottomNavigationAction
                  icon={<Icon>language</Icon>}
                  label="General"
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? this.props.slideIndex === 0
                        ? { color: "#fff" }
                        : { color: "#fff", opacity: 0.5 }
                      : this.props.slideIndex === 0
                      ? { color: "#0083ff" }
                      : { color: "#757575" }
                  }
                />
                <BottomNavigationAction
                  icon={<Icon>account_box</Icon>}
                  label="Account"
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? this.props.slideIndex === 1
                        ? { color: "#fff" }
                        : { color: "#fff", opacity: 0.5 }
                      : this.props.slideIndex === 1
                      ? { color: "#0083ff" }
                      : { color: "#757575" }
                  }
                />
                {typeof Storage !== "undefined" &&
                  localStorage.getItem("devMode") === "true" && (
                    <BottomNavigationAction
                      icon={<Icon>code</Icon>}
                      label="Development"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? this.props.slideIndex === 2
                            ? { color: "#fff" }
                            : { color: "#fff", opacity: 0.5 }
                          : this.props.slideIndex === 2
                          ? { color: "#0083ff" }
                          : { color: "#757575" }
                      }
                    />
                  )}
              </BottomNavigation>
            </AppBar>
          </Dialog>
        )}
        {/* 
        <TwoFactorDialog
          isOpen={this.props.isOpen && this.state.twoFactorDialogOpen}
          handleTwoFactorDialogOpen={this.handleTwoFactorDialogOpen}
          handleTwoFactorDialogClose={this.handleTwoFactorDialogClose}
        /> */}
        <DeleteAccountDialog
          deleteOpen={this.props.isOpen && this.state.deleteDialogOpen}
          deleteConfirmedOpen={this.state.deleteConfirmedDialogOpen}
          isDeleteDisabled={this.state.isDeleteDisabled}
          timer={this.state.timer}
          deleteConfirmed={this.deleteConfirmed}
          closeDeleteConfirmed={this.handleDeleteConfirmedClose}
          closeDelete={this.handleDeleteDialogClose}
        />
        <ChangePasswordDialog
          passwordDialogOpen={
            this.props.isOpen && this.state.passwordDialogOpen
          }
          handlePasswordDialogClose={this.handlePasswordDialogClose}
        />
        {/* <ManageEmailDialog
          confirmationDialogOpen={
            this.props.isOpen && this.state.emailDialogOpen
          }
          handleEmailDialogClose={this.handleEmailDialogClose}
        /> */}
        <ManageAuthorizations
          confirmationDialogOpen={
            this.props.isOpen && this.state.authDialogOpen
          }
          handleAuthDialogClose={this.handleAuthDialogClose}
          userData={this.props.userData}
        />
        {/*<ChangeLanguageDialog
          handleLanguageDialogClose={this.handleLanguageDialogClose}
          languageDialogOpen={
            this.props.isOpen && this.state.languageDialogOpen
          }
        />
        <TimeZoneDialog
          handleTimeDialogClose={this.handleTimeDialogClose}
          timeZoneDialogOpen={
            this.props.isOpen && this.state.timeZoneDialogOpen
          }
        /> */}
        <TimeFormatDialog
          handleTimeFormatDialogClose={this.handleTimeFormatDialogClose}
          timeFormatDialogOpen={
            this.props.isOpen && this.state.timeFormatDialogOpen
          }
        />
        <UnitOfMeasumentDialog
          handleUnitDialogClose={this.handleUnitDialogClose}
          unitDialogOpen={this.props.isOpen && this.state.unitDialogOpen}
        />
        <ChangeNameDialog
          handleNameDialogClose={this.handleNameDialogClose}
          confirmationDialogOpen={
            this.props.isOpen && this.state.nameDialogOpen
          }
          userData={this.props.userData}
          fullName={fullName}
          profileIconColor={profileIconColor}
        />
        <Shortcuts
          handleShortcutDialogClose={this.handleShortcutDialogClose}
          shortcutDialogOpen={
            this.props.isOpen && this.state.shortcutDialogOpen
          }
        />
        <CreateValue
          open={this.props.isOpen && this.state.createValueOpen}
          close={() => this.setState({ createValueOpen: false })}
          userData={this.props.userData}
          allDevices={allDevices}
        />
        {this.props.userData.user && this.props.userData.user.boards && (
          <CreateDevice
            open={this.props.isOpen && this.state.createDeviceOpen}
            close={() => this.setState({ createDeviceOpen: false })}
            userData={this.props.userData}
          />
        )}
        <CreateNotification
          open={this.props.isOpen && this.state.createNotificationOpen}
          close={() => this.setState({ createNotificationOpen: false })}
          userData={this.props.userData}
          allDevices={allDevices}
        />
        <CreatePlotNode
          open={this.props.isOpen && this.state.createNodeOpen}
          close={() => this.setState({ createNodeOpen: false })}
          userData={this.props.userData}
        />
        <GDPRDataDownload
          open={this.props.isOpen && this.state.gdprOpen}
          close={() => this.setState({ gdprOpen: false })}
        />
        <ChangeEmail
          confirmationDialogOpen={
            this.props.isOpen && this.state.emailDialogOpen
          }
          handleEmailDialogClose={() =>
            this.setState({ emailDialogOpen: false })
          }
          userData={this.props.userData}
        />
        <ChangeServer
          open={this.props.isOpen && this.state.serverOpen}
          close={() => this.setState({ serverOpen: false })}
          logOut={this.props.logOut}
          forceUpdate={() => this.props.forceUpdate()}
        />
        <VerifyEmailDialog
          open={this.props.isOpen && this.state.verifyOpen}
          close={() => this.setState({ verifyOpen: false })}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ToggleQuietMode($quietMode: Boolean!) {
      user(quietMode: $quietMode) {
        id
        quietMode
      }
    }
  `,
  {
    name: "ToggleQuietMode",
  }
)(SettingsDialog)
