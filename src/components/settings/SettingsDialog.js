import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Slide from "@material-ui/core/Slide"
import Grow from "@material-ui/core/Grow"
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
import DeleteAccountDialog from "./DeleteAccount"
import TimeFormatDialog from "./TimeFormat"
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
import withMobileDialog from "@material-ui/core/withMobileDialog"
import Code from "@material-ui/icons/Code"
import Close from "@material-ui/icons/Close"
import AccountBox from "@material-ui/icons/AccountBox"
import Language from "@material-ui/icons/Language"
import MailingOptions from "./MailingOptions"
import AuthenticationOptions from "./AuthenticationOptions"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

let installPromptEvent

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
  mailingOpen: false,
  authenticationOpen: false
}

class SettingsDialog extends React.Component {
  state = {
    isDeleteDisabled: true,
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
    })
  }

  deleteConfirmed = () => {
    this.handleDeleteDialogClose()
    this.handleDeleteConfirmedOpen()
  }

  handleDeleteConfirmedOpen = () => {
    this.setState({ deleteConfirmedDialogOpen: true })
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen && nextProps.isOpen) {
      this.setState(allDialogsClosed)
    }
  }

  addToHomeScreen = () => {
    if (installPromptEvent) {
      // Show the modal add to home screen dialog
      installPromptEvent.prompt()
      // Wait for the user to respond to the prompt
      installPromptEvent.userChoice.then(() => {
        // Clear the saved prompt since it can't be used again
        installPromptEvent = null
        this.forceUpdate()
      })
    }
  }

  render() {
    const {
      userData: { user },
    } = this.props

    window.addEventListener("beforeinstallprompt", event => {
      // Prevent Chrome <= 67 from automatically showing the install prompt
      event.preventDefault()
      // Stash the event so it can be triggered later.
      installPromptEvent = event
      this.forceUpdate()
    })

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

    let name = ""

    let profileIconColor = ""

    if (user) {
      toggleQuietMode = quietMode => {
        this.props.ToggleQuietMode({
          variables: {
            quietMode,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              quietMode,
              __typename: "User",
            },
          },
        })
      }

      name = user.name

      profileIconColor = user.profileIconColor
    }

    let uiSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? !this.props.fullScreen
              ? {
                  overflowY: "auto",
                  height: "calc(100vh - 220px)",
                  maxHeight: "550px",
                }
              : {
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                }
            : !this.props.fullScreen
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
          <List style={{ width: "100%", padding: "0" }} subheader={<li />}>
            <li key="appearance">
              <ul style={{ padding: "0" }}>
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
                  className="notSelectable defaultCursor"
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
              </ul>
            </li>
            <li key="tokens">
              <ul style={{ padding: "0" }}>
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
                  className="notSelectable defaultCursor"
                >
                  Notifications
                </ListSubheader>
                <ListItem
                  disabled={!user}
                  button
                  disableRipple
                  onClick={() => toggleQuietMode(!user.quietMode)}
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
                      onChange={() => toggleQuietMode(!user.quietMode)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </ul>
            </li>
            <li key="localization">
              <ul style={{ padding: "0" }}>
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
                  className="notSelectable defaultCursor"
                >
                  Localization
                </ListSubheader>
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
                        {user &&
                          (user.settings.lengthAndMass === "SI"
                            ? "SI"
                            : "Imperial") +
                            ", " +
                            (user.settings.temperature === "CELSIUS"
                              ? "Celsius"
                              : user.settings.temperature === "FAHRENHEIT"
                              ? "Fahreinheit"
                              : "Kelvin")}
                      </font>
                    }
                  />
                </ListItem>
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
                        {user &&
                          (user.settings.dateFormat === "MDY"
                            ? "MM/DD/YYYY"
                            : user.settings.dateFormat === "DMY"
                            ? "DD/MM/YYYY"
                            : user.settings.dateFormat === "YMD"
                            ? "YYYY/MM/DD"
                            : "YYYY/DD/MM") +
                            ", " +
                            (user.settings.timeFormat === "H12"
                              ? "12-hour clock"
                              : "24-hour clock")}
                      </font>
                    }
                  />
                </ListItem>
                <Divider />
              </ul>
            </li>
            <li key="miscellaneous">
              <ul style={{ padding: "0" }}>
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
                  className="notSelectable defaultCursor"
                >
                  Miscellaneous
                </ListSubheader>
                {installPromptEvent && (
                  <ListItem button onClick={this.addToHomeScreen}>
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
                )}
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
              </ul>
            </li>
          </List>
        </div>
      </div>
    )

    let accountSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? !this.props.fullScreen
              ? {
                  overflowY: "auto",
                  height: "calc(100vh - 220px)",
                  maxHeight: "550px",
                }
              : {
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                }
            : !this.props.fullScreen
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
        <List subheader={<li />}>
          <li key="authentication">
            <ul style={{ padding: "0" }}>
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
                className="notSelectable defaultCursor"
              >
                Authentication
              </ListSubheader>
              <ListItem
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
                button
                onClick={() => this.setState({ authenticationOpen: true })}
                disabled={!user}
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
                      Authentication methods
                    </font>
                  }
                />
              </ListItem>
              <Divider />
            </ul>
          </li>
          <li key="account">
            <ul style={{ padding: "0" }}>
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
                className="notSelectable defaultCursor"
              >
                Account management
              </ListSubheader>
              {user && !user.emailIsVerified && (
                <ListItem
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
              <ListItem
                button
                onClick={() => this.setState({ mailingOpen: true })}
                disabled={!user}
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
                      Mailing options
                    </font>
                  }
                />
              </ListItem>
              <ListItem
                disabled={!user}
                button
                onClick={this.handleNameDialogOpen}
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
              <ListItem button onClick={this.handleDeleteDialogOpen}>
                <ListItemText
                  primary={
                    <font style={{ color: "#f44336" }}>
                      Delete your account
                    </font>
                  }
                />
              </ListItem>
            </ul>
          </li>
        </List>
      </div>
    )

    let settingsContent =
      typeof Storage !== "undefined" &&
      localStorage.getItem("devMode") === "true" ? (
        <SwipeableViews
          index={this.props.slideIndex}
          onChangeIndex={this.props.handleSwipe}
          style={{ overflowY: "hidden" }}
        >
          {uiSettings}
          {accountSettings}
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? !this.props.fullScreen
                  ? {
                      overflowY: "auto",
                      height: "calc(100vh - 220px)",
                      maxHeight: "550px",
                    }
                  : {
                      overflowY: "auto",
                      height: "calc(100vh - 128px)",
                    }
                : !this.props.fullScreen
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
            <List subheader={<li />}>
              <li key="tokens">
                <ul style={{ padding: "0" }}>
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
                    className="notSelectable defaultCursor"
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
                          Generate, view and delete your account's access tokens
                        </font>
                      }
                    />
                  </ListItem>
                  <Divider />
                </ul>
              </li>
              <li key="devicesValues">
                <ul style={{ padding: "0" }}>
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
                    className="notSelectable defaultCursor"
                  >
                    Devices, values and notifications
                  </ListSubheader>
                  <ListItem
                    disabled={
                      !(
                        user &&
                        user.environments.filter(
                          environment => environment.myRole !== "SPECTATOR"
                        )[0]
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
                          Create device
                        </font>
                      }
                    />
                  </ListItem>
                  <ListItem
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
                          Create value
                        </font>
                      }
                    />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() =>
                      this.setState({ createNotificationOpen: true })
                    }
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
                          Create notification
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
                          Create plot node
                        </font>
                      }
                    />
                  </ListItem>
                  <ListItem
                    disabled={!user}
                    button
                    onClick={() =>
                      this.setState({ createCategoryNodeOpen: true })
                    }
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
                          Create category plot node
                        </font>
                      }
                    />
                  </ListItem>
                  <Divider />
                </ul>
              </li>
              <li key="testing">
                <ul style={{ padding: "0" }}>
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
                    className="notSelectable defaultCursor"
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
                </ul>
              </li>
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
        <Dialog
          open={
            this.props.isOpen &&
            !this.state.deleteDialogOpen &&
            !this.state.passwordDialogOpen &&
            !this.state.emailDialogOpen &&
            !this.state.deleteConfirmedDialogOpen &&
            !this.state.twoFactorDialogOpen &&
            !this.state.languageDialogOpen &&
            !this.state.timeZoneDialogOpen &&
            !this.state.timeFormatDialogOpen &&
            !this.state.unitDialogOpen &&
            !this.state.nameDialogOpen &&
            !this.state.shortcutDialogOpen &&
            !this.state.authDialogOpen &&
            !this.state.createValueOpen &&
            !this.state.createDeviceOpen &&
            !this.state.createNotificationOpen &&
            !this.state.createNodeOpen &&
            !this.state.gdprOpen &&
            !this.state.serverOpen &&
            !this.state.verifyOpen &&
            !this.state.mailingOpen &&
            !this.state.authenticationOpen
          }
          onClose={this.props.closeSettingsDialog}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullWidth
          maxWidth="sm"
          fullScreen={this.props.fullScreen}
        >
          {!this.props.fullScreen ? (
            <React.Fragment>
              <DialogTitle style={{ padding: "0" }}>
                <AppBar position="sticky">
                  <Tabs
                    onChange={this.props.handleSettingsTabChanged}
                    value={this.props.slideIndex}
                    centered
                    fullWidth
                  >
                    <Tab
                      icon={<Language />}
                      label="General"
                      value={0}
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("devMode") === "true"
                          ? { width: "33%" }
                          : { width: "50%" }
                      }
                    />
                    <Tab
                      icon={<AccountBox />}
                      label="Account"
                      value={1}
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("devMode") === "true"
                          ? { width: "33%" }
                          : { width: "50%" }
                      }
                    />
                    {typeof Storage !== "undefined" &&
                      localStorage.getItem("devMode") === "true" && (
                        <Tab
                          icon={<Code />}
                          label="Development"
                          value={2}
                          style={{ width: "33%" }}
                        />
                      )}
                  </Tabs>
                </AppBar>
              </DialogTitle>
              {settingsContent}
              <DialogActions>
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
            </React.Fragment>
          ) : (
            <React.Fragment>
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
                    Settings
                  </Typography>
                  <Tooltip id="tooltip-bottom" title="Close" placement="bottom">
                    <IconButton
                      onClick={this.props.closeSettingsDialog}
                      style={{
                        marginRight: "-16px",
                        marginLeft: "auto",
                        color: "white",
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </AppBar>
              {settingsContent}
              <AppBar
                color="default"
                position="static"
                style={{
                  marginBottom: "0px",
                  marginTop: "auto",
                  height: "64px",
                }}
              >
                <BottomNavigation
                  onChange={this.props.handleSettingsTabChanged}
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
                    icon={<Language />}
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
                    icon={<AccountBox />}
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
                        icon={<Code />}
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
            </React.Fragment>
          )}
        </Dialog>
        <DeleteAccountDialog
          open={this.props.isOpen && this.state.deleteDialogOpen}
          close={() => this.setState({ deleteDialogOpen: false })}
          client={this.props.client}
          forceUpdate={() => this.props.forceUpdate()}
          logOut={this.props.logOut}
        />
        <ManageAuthorizations
          open={
            this.props.isOpen && this.state.authDialogOpen
          }
          close={()=>this.setState({authDialogOpen:false})}
          userData={this.props.userData}
          client={this.props.client}
          logOut={this.props.logOut}
        />
        <TimeFormatDialog
          handleTimeFormatDialogClose={this.handleTimeFormatDialogClose}
          timeFormatDialogOpen={
            this.props.isOpen && this.state.timeFormatDialogOpen
          }
          dateFormat={
            this.props.userData.user &&
            this.props.userData.user.settings.dateFormat
          }
          timeFormat={
            this.props.userData.user &&
            this.props.userData.user.settings.timeFormat
          }
        />
        <UnitOfMeasumentDialog
          handleUnitDialogClose={this.handleUnitDialogClose}
          unitDialogOpen={this.props.isOpen && this.state.unitDialogOpen}
          temperature={
            this.props.userData.user &&
            this.props.userData.user.settings.temperature
          }
          lengthMass={
            this.props.userData.user &&
            this.props.userData.user.settings.lengthAndMass
          }
        />
        <ChangeNameDialog
          handleNameDialogClose={this.handleNameDialogClose}
          confirmationDialogOpen={
            this.props.isOpen && this.state.nameDialogOpen
          }
          userData={this.props.userData}
          name={name}
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
          openDialog={() => this.setState({ createvalueOpen: true })}
          close={() => this.setState({ createValueOpen: false })}
          userData={this.props.userData}
        />
        <CreateDevice
          open={this.props.isOpen && this.state.createDeviceOpen}
          close={() => this.setState({ createDeviceOpen: false })}
          userData={this.props.userData}
        />
        <CreateNotification
          open={this.props.isOpen && this.state.createNotificationOpen}
          close={() => this.setState({ createNotificationOpen: false })}
          userData={this.props.userData}
        />
        <CreatePlotNode
          open={this.props.isOpen && this.state.createNodeOpen}
          close={() => this.setState({ createNodeOpen: false })}
          userData={this.props.userData}
        />
        <GDPRDataDownload
          open={this.props.isOpen && this.state.gdprOpen}
          close={() => this.setState({ gdprOpen: false })}
          logOut={this.props.logOut}
        />
        <ChangeEmail
          open={this.props.isOpen && this.state.emailDialogOpen}
          close={() => this.setState({ emailDialogOpen: false })}
          userData={this.props.userData}
          client={this.props.client}
          email={user && user.email}
          user={user}
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
        <MailingOptions
          open={this.props.isOpen && this.state.mailingOpen}
          close={() => this.setState({ mailingOpen: false })}
        />
        <AuthenticationOptions open={this.state.authenticationOpen} close={()=>this.setState({authenticationOpen:false})} client={this.props.client}  user={user}/>
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
)(withMobileDialog({ breakpoint: "xs" })(SettingsDialog))
