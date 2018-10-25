import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Toggle from "material-ui/Toggle"
import { List, ListItem } from "material-ui/List"
import Subheader from "material-ui/Subheader"
import Divider from "material-ui/Divider"
import SwipeableViews from "react-swipeable-views"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import ChangeNameDialog from "./ChangeName"
import TwoFactorDialog from "./Enable2FA"
import DeleteAccountDialog from "./DeleteAccount"
// import ManageEmailDialog from "./ManageEmail"
import ChangePasswordDialog from "./ChangePassword"
import ChangeLanguageDialog from "./ChangeLanguage"
import TimeFormatDialog from "./TimeFormat"
// import TimeZoneDialog from "./TimeZone"
import UnitOfMeasumentDialog from "./UnitOfMeasurement"
import Shortcuts from "./Shortcuts"
import Icon from "@material-ui/core/Icon"
import Slide from "@material-ui/core/Slide"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import ManageAuthorizations from "./ManageAuthorizations"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import CreateValue from "./CreateValue"
import CreateDevice from "./CreateDevice"
import CreateNotification from "./CreateNotification"
import GDPRDataDownload from "./GDPRDataDownload"
import CreatePlotNode from "./CreatePlotNode"
import Toolbar from "@material-ui/core/Toolbar"
import Translate from "translate-components"
import Tooltip from "@material-ui/core/Tooltip"
import ChangeEmail from "./ChangeEmail"
import ChangeServer from "./ChangeServer"
import VerifyEmailDialog from "../VerifyEmailDialog"

function Transition(props) {
  return <Slide direction="up" {...props} />
}

// var moment = require("moment-timezone")

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0057cb" },
  },
})

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

class SettingsDialogMobile extends React.Component {
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

  handleAuthDialogOpen = () => {
    this.setState({ authDialogOpen: true })
  }

  handleAuthDialogClose = () => {
    this.setState({ authDialogOpen: false })
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

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let toggleNightMode = () => {
      if (typeof Storage !== "undefined") {
        !localStorage.getItem("nightMode") &&
          localStorage.setItem("nightMode", "false")

        localStorage.setItem(
          "nightMode",
          !(localStorage.getItem("nightMode") === "true")
        )
      }
    }

    let devModeSetting = (
      <ListItem
        primaryText="Developer mode"
        rightToggle={
          <Toggle
            thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
            trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
            rippleStyle={{ color: "#0083ff" }}
            disabled
          />
        }
      />
    )

    let nightModeSetting = typeof Storage !== "undefined" && (
      <ListItem
        primaryText="Night mode"
        rightToggle={
          <Toggle
            thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
            trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
            rippleStyle={{ color: "#0083ff" }}
            defaultToggled={localStorage.getItem("nightMode") === "true"}
            onToggle={toggleNightMode}
          />
        }
      />
    )

    let quietModeSetting = (
      <ListItem
        primaryText="Quiet mode"
        secondaryText="Mute all notifications"
        rightToggle={
          <Toggle
            thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
            trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
            rippleStyle={{ color: "#0083ff" }}
            disabled
          />
        }
      />
    )

    let devModeTab = ""

    let toggleDevMode = () => {}

    let toggleQuietMode = () => {}

    let deviceList = "No devices"

    // let languageText = "English"

    let fullName = ""

    let profileIconColor = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user) {
      deviceList = (
        <List style={{ padding: "0" }}>
          {user.devices.map(device => (
            <ListItem
              className="notSelectable"
              primaryText={device.customName}
              key={device.id}
              style={{
                backgroundColor: "transparent",
              }}
              leftIcon={
                device.icon ? (
                  <img
                    className="deviceIcon"
                    src={device.icon}
                    alt="device logo"
                  />
                ) : (
                  <Icon>lightbulb_outline</Icon>
                )
              }
              rightToggle={
                <Toggle
                  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                  rippleStyle={{ color: "#0083ff" }}
                  defaultToggled={true}
                />
              }
            />
          ))}
        </List>
      )

      devModeSetting = (
        <ListItem
          primaryText="Developer mode"
          rightToggle={
            <Toggle
              thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
              trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
              rippleStyle={{ color: "#0083ff" }}
              defaultToggled={user.devMode}
              onToggle={() => {
                user.devMode ? toggleDevMode(false) : toggleDevMode(true)
              }}
            />
          }
        />
      )

      quietModeSetting = (
        <ListItem
          primaryText="Quiet mode"
          secondaryText="Mute all notifications"
          rightToggle={
            <Toggle
              thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
              trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
              rippleStyle={{ color: "#0083ff" }}
              defaultToggled={user.quietMode}
              onToggle={() => {
                user.quietMode ? toggleQuietMode(false) : toggleQuietMode(true)
              }}
            />
          }
        />
      )

      devModeTab = user.devMode ? (
        <BottomNavigationAction
          icon={<Icon>code</Icon>}
          label="Development"
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? this.props.slideIndex === 3
                ? { color: "#fff" }
                : { color: "#fff", opacity: 0.5 }
              : this.props.slideIndex === 3
                ? { color: "#0083ff" }
                : { color: "#757575" }
          }
        />
      ) : (
        ""
      )

      toggleDevMode = devMode => {
        this.props["ToggleDevMode"]({
          variables: {
            devMode: devMode,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              devMode: devMode,
              __typename: "User",
            },
          },
        })
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
      /*
      switch (user.language) {
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
            ? {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
                background: "rgb(33, 37, 43)",
              }
            : {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
              }
        }
      >
        <div style={listStyles.root}>
          <List style={{ width: "100%", padding: "0" }}>
            <Subheader style={{ cursor: "default" }}>Appearance</Subheader>
            {nightModeSetting}
            <Divider />
            <Subheader style={{ cursor: "default" }}>Localization</Subheader>
            {/*
  <ListItem
    primaryText="Change language"
    secondaryText={languageText}
    onClick={this.handleLanguageDialogOpen}
  /> */}
            <ListItem
              primaryText="Change units of measurement"
              secondaryText="SI, Celsius"
              onClick={this.handleUnitDialogOpen}
            />
            {/*     <Divider />
  <Subheader style={{ cursor: "default" }}>Time</Subheader>
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
              primaryText="Change date and time format"
              secondaryText="DD/MM/YYYY, 24-hour clock"
              onClick={this.handleTimeFormatDialogOpen}
            />
            <Divider />
            <Subheader style={{ cursor: "default" }}>Accessibility</Subheader>
            <ListItem
              primaryText="Keyboard shortcuts"
              onClick={this.handleShortcutDialogOpen}
            />
          </List>
        </div>
      </div>
    )

    let notificationsSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
                background: "rgb(33, 37, 43)",
              }
            : {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
              }
        }
      >
        <div style={listStyles.root}>
          <List style={{ width: "100%", padding: "0" }}>
            <Subheader style={{ cursor: "default" }}>Lorem Ipsum</Subheader>
            {quietModeSetting}
            <Divider />
            <Subheader style={{ cursor: "default" }}>Lorem Ipsum</Subheader>
            {deviceList}
          </List>
        </div>
      </div>
    )

    let accountSettings = (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
                background: "rgb(33, 37, 43)",
              }
            : {
                overflowY: "auto",
                height: "calc(100vh - 128px)",
                overflowX: "hidden",
              }
        }
      >
        <List style={{ padding: "0" }}>
          <Subheader style={{ cursor: "default" }}>Authentication</Subheader>
          {/* <ListItem
primaryText="Manage emails"
secondaryText="Add or delete emails you use to log in"
onClick={this.handleEmailDialogOpen}
/> */}
          <ListItem
            primaryText="Change email"
            onClick={() => this.setState({ emailDialogOpen: true })}
          />
          <ListItem
            primaryText="Change password"
            onClick={this.handlePasswordDialogOpen}
          />
          <ListItem
            primaryText="Log out at the end of every session"
            rightToggle={
              <Toggle
                thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                rippleStyle={{ color: "#0083ff" }}
                onClick={() =>
                  localStorage.setItem("keepLoggedIn", !this.state.keepLoggedIn)
                }
              />
            }
          />
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
          <Subheader style={{ cursor: "default" }}>For developers</Subheader>
          {devModeSetting}
          <Divider />
          <Subheader style={{ cursor: "default" }}>
            Account management
          </Subheader>
          {user &&
            !user.emailIsVerified && (
              <ListItem
                primaryText="Resend verifcation email"
                onClick={() => this.setState({ verifyOpen: true })}
              />
            )}
          <ListItem
            primaryText="Manage your profile"
            secondaryText="Change your profile photo and name"
            onClick={this.handleNameDialogOpen}
          />
          <ListItem
            primaryText="Download your data"
            secondaryText="Transfer your data to another service"
            onClick={() => this.setState({ gdprOpen: true })}
          />
          <ListItem
            primaryText="Delete your account"
            onClick={this.handleDeleteDialogOpen}
            style={{ color: "#F44336" }}
          />
        </List>
      </div>
    )

    return (
      <React.Fragment>
        <Dialog
          modal={false}
          open={this.props.isOpen}
          onRequestClose={this.props.closeSettingsDialog}
          bodyStyle={{ padding: "0" }}
          repositionOnUpdate={true}
          className="notSelectable"
          fullScreen
          TransitionComponent={Transition}
        >
          <MuiThemeProvider theme={theme}>
            <AppBar position="sticky" style={{ height: "64px" }}>
              <Toolbar
                style={{
                  height: "64px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                }}
              >
                <Typography
                  variant="title"
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
                    color="inherit"
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
          </MuiThemeProvider>
          {user && user.devMode ? (
            <SwipeableViews
              index={this.props.slideIndex}
              onChangeIndex={this.props.handleChange}
            >
              {uiSettings}
              {notificationsSettings}
              {accountSettings}
              <div
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        overflowY: "auto",
                        height: "calc(100vh - 128px)",
                        overflowX: "hidden",
                        background: "rgb(33, 37, 43)",
                      }
                    : {
                        overflowY: "auto",
                        height: "calc(100vh - 128px)",
                        overflowX: "hidden",
                      }
                }
              >
                <List style={{ padding: "0" }}>
                  <Subheader style={{ cursor: "default" }}>Tokens</Subheader>
                  <ListItem
                    primaryText="Manage authorizations"
                    secondaryText="Generate, view and delete your account's access tokens"
                    onClick={this.handleAuthDialogOpen}
                  />
                  <Divider />
                  <Subheader style={{ cursor: "default" }}>
                    Devices and values
                  </Subheader>
                  <ListItem
                    primaryText="Create a new device"
                    onClick={() => this.setState({ createDeviceOpen: true })}
                  />
                  <ListItem
                    primaryText="Create a new value"
                    onClick={() => this.setState({ createValueOpen: true })}
                  />
                  <ListItem
                    primaryText="Create a new plot node"
                    onClick={() => this.setState({ createNodeOpen: true })}
                  />
                  <ListItem
                    primaryText="Create a new notification"
                    onClick={() =>
                      this.setState({ createNotificationOpen: true })
                    }
                  />
                  <Subheader style={{ cursor: "default" }}>Testing</Subheader>
                  <ListItem
                    primaryText="Change connected server"
                    onClick={() => this.setState({ serverOpen: true })}
                  />
                </List>
              </div>
            </SwipeableViews>
          ) : (
            <SwipeableViews
              index={this.props.slideIndex}
              onChangeIndex={this.props.handleChange}
            >
              {uiSettings}
              {notificationsSettings}
              {accountSettings}
            </SwipeableViews>
          )}
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
                icon={<Icon>dashboard</Icon>}
                label="Interface"
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
                icon={<Icon>notifications</Icon>}
                label="Notifications"
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
              <BottomNavigationAction
                icon={<Icon>account_box</Icon>}
                label="Account"
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
              {devModeTab}
            </BottomNavigation>
          </AppBar>
        </Dialog>
        <TwoFactorDialog
          isOpen={this.props.isOpen && this.state.twoFactorDialogOpen}
          handleTwoFactorDialogOpen={this.handleTwoFactorDialogOpen}
          handleTwoFactorDialogClose={this.handleTwoFactorDialogClose}
        />
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
        {/*
        <ManageEmailDialog
          confirmationDialogOpen={
            this.props.isOpen && this.state.emailDialogOpen
          }
          handleEmailDialogClose={this.handleEmailDialogClose}
          userData={this.props.userData}
        /> */}
        <ChangeLanguageDialog
          handleLanguageDialogClose={this.handleLanguageDialogClose}
          languageDialogOpen={
            this.props.isOpen && this.state.languageDialogOpen
          }
        />
        {/* <TimeZoneDialog
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
        <ManageAuthorizations
          confirmationDialogOpen={
            this.props.isOpen && this.state.authDialogOpen
          }
          handleAuthDialogClose={this.handleAuthDialogClose}
          userData={this.props.userData}
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
        />
        <CreateDevice
          open={this.props.isOpen && this.state.createDeviceOpen}
          close={() => this.setState({ createDeviceOpen: false })}
          userData={this.props.userData}
        />
        <CreatePlotNode
          open={this.props.isOpen && this.state.createNodeOpen}
          close={() => this.setState({ createNodeOpen: false })}
          userData={this.props.userData}
        />
        <CreateNotification
          open={this.props.isOpen && this.state.createNotificationOpen}
          close={() => this.setState({ createNotificationOpen: false })}
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
    mutation ToggleDevMode($devMode: Boolean!) {
      user(devMode: $devMode) {
        id
        devMode
      }
    }
  `,
  {
    name: "ToggleDevMode",
  }
)(
  graphql(
    gql`
      mutation ToggleNightMode($nightMode: Boolean!) {
        user(nightMode: $nightMode) {
          id
          nightMode
        }
      }
    `,
    {
      name: "ToggleNightMode",
    }
  )(
    graphql(
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
    )(SettingsDialogMobile)
  )
)
