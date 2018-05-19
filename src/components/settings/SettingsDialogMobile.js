import React from "react"
import Dialog from "material-ui-next/Dialog"
import DialogActions from "material-ui-next/Dialog/DialogActions"
import Button from "material-ui-next/Button"
import Toggle from "material-ui/Toggle"
import { List, ListItem } from "material-ui/List"
import Subheader from "material-ui/Subheader"
import Divider from "material-ui/Divider"
import SwipeableViews from "react-swipeable-views"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import ChangeNameDialog from "./ChangeName"
import TwoFactorDialog from "./Enabled2FA"
import DeleteAccountDialog from "./DeleteAccount"
import ChangeEmailDialog from "./ChangeEmail"
import ChangePasswordDialog from "./ChangePassword"
import ChangeLanguageDialog from "./ChangeLanguage"
import TimeFormatDialog from "./TimeFormat"
import TimeZoneDialog from "./TimeZone"
import UnitOfMeasumentDialog from "./UnitOfMeasurement"
import Shortcuts from "./Shortcuts"
import Icon from "material-ui-next/Icon"
import Slide from "material-ui-next/transitions/Slide"
import BottomNavigation from "material-ui-next/BottomNavigation"
import BottomNavigationAction from "material-ui-next/BottomNavigation/BottomNavigationAction"
import AppBar from "material-ui-next/AppBar"
import IconButton from "material-ui-next/IconButton"
import Typography from "material-ui-next/Typography"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

function Transition(props) {
  return <Slide direction="up" {...props} />
}

var moment = require("moment-timezone")

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

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceList = "No devices"

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
        <List>
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
            <AppBar>
              <Typography variant="title" color="inherit">
                Settings
              </Typography>
              <IconButton
                color="inherit"
                onClick={this.props.closeSettingsDialog}
                aria-label="Close"
              >
                <Icon>close</Icon>
              </IconButton>
            </AppBar>
          </MuiThemeProvider>
          <SwipeableViews
            index={this.props.slideIndex}
            onChangeIndex={this.props.handleChange}
            enableMouseEvents
          >
            <div
              style={{
                overflowY: "auto",
              }}
            >
              <div style={listStyles.root}>
                <List style={{ width: "100%" }}>
                  <Subheader style={{ cursor: "default" }}>
                    Localization
                  </Subheader>
                  <ListItem
                    primaryText="Change language"
                    secondaryText="English"
                    onClick={this.handleLanguageDialogOpen}
                  />
                  <ListItem
                    primaryText="Change units of measurement"
                    secondaryText="SI, Celsius"
                    onClick={this.handleUnitDialogOpen}
                  />
                  <Divider />
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
                  />
                  <ListItem
                    primaryText="Change date and time format"
                    secondaryText="DD/MM/YYYY, 24-hour clock"
                    onClick={this.handleTimeFormatDialogOpen}
                  />
                  <Subheader style={{ cursor: "default" }}>
                    Lorem Ipsum
                  </Subheader>
                  <ListItem
                    primaryText="Keyboard shortcuts"
                    onClick={this.handleShortcutDialogOpen}
                  />
                </List>
              </div>
            </div>
            <div
              style={{
                overflowY: "auto",
              }}
            >
              <div style={listStyles.root}>
                <List style={{ width: "100%" }}>
                  <Subheader style={{ cursor: "default" }}>
                    Lorem Ipsum
                  </Subheader>
                  <ListItem
                    primaryText="Quiet mode"
                    secondaryText="Mute all notifications"
                    rightToggle={
                      <Toggle
                        thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                        trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                        rippleStyle={{ color: "#0083ff" }}
                      />
                    }
                  />
                  <ListItem
                    primaryText="Receive notifications from hidden devices"
                    rightToggle={
                      <Toggle
                        thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                        trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                        rippleStyle={{ color: "#0083ff" }}
                      />
                    }
                  />
                  <Divider />
                  <Subheader style={{ cursor: "default" }}>
                    Lorem Ipsum
                  </Subheader>
                  {deviceList}
                </List>
              </div>
            </div>
            <div
              style={{
                overflowY: "auto",
              }}
            >
              <List>
                <Subheader style={{ cursor: "default" }}>
                  Authentication
                </Subheader>
                <ListItem
                  primaryText="Change user name"
                  onClick={this.handleNameDialogOpen}
                />
                <ListItem
                  primaryText="Manage emails"
                  secondaryText="Add or delete emails you use to log in"
                  onClick={this.handleEmailDialogOpen}
                />
                <ListItem
                  primaryText="Change password"
                  onClick={this.handlePasswordDialogOpen}
                />
                <ListItem
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
                <Divider />
                <Subheader style={{ cursor: "default" }}>Lorem Ipsum</Subheader>
                <ListItem
                  primaryText="Manage roles"
                  secondaryText="Lorem Ipsum"
                />
                <ListItem
                  primaryText="Manage authorizations"
                  secondaryText="Lorem Ipsum"
                />
                <Divider />
                <Subheader style={{ cursor: "default" }}>
                  Account management
                </Subheader>
                <ListItem
                  primaryText="Delete your account"
                  onClick={this.handleDeleteDialogOpen}
                  style={{ color: "#F44336 " }}
                />
              </List>
            </div>
          </SwipeableViews>
          <AppBar color="default" position="static">
            <BottomNavigation
              onChange={this.props.handleChangeBTIndex}
              value={this.props.slideIndex}
              showLabels
            >
              <BottomNavigationAction
                icon={<Icon>dashboard</Icon>}
                label="Interface"
                style={
                  this.props.slideIndex === 0
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
              <BottomNavigationAction
                icon={<Icon>notifications</Icon>}
                label="Notifications"
                style={
                  this.props.slideIndex === 1
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
              <BottomNavigationAction
                icon={<Icon>account_box</Icon>}
                label="Account"
                style={
                  this.props.slideIndex === 2
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
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
        <ChangeEmailDialog
          confirmationDialogOpen={
            this.props.isOpen && this.state.emailDialogOpen
          }
          handleEmailDialogClose={this.handleEmailDialogClose}
        />
        <ChangeLanguageDialog
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
        />
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
        />
        <Shortcuts
          handleShortcutDialogClose={this.handleShortcutDialogClose}
          shortcutDialogOpen={
            this.props.isOpen && this.state.shortcutDialogOpen
          }
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        devices {
          id
          customName
          icon
        }
      }
    }
  `,
  { name: "userData" }
)(SettingsDialog)
