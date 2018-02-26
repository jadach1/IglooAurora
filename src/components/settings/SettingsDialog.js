import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import { Tabs, Tab } from "material-ui/Tabs"
import FontIcon from "material-ui/FontIcon"
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

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

class SettingsDialog extends React.Component {
  state = {
    deleteDialogOpen: false,
    passwordDialogOpen: false,
    emailDialogOpen: false,
    deleteConfirmedDialogOpen: false,
    isDeleteDisabled: true,
    timer: 5,
    stepIndex: 0,
    slideIndex: 0,
    showHidden: false,
    twoFactorDialogOpen: false,
    languageDialogOpen: false,
    timeZoneDialogOpen: false,
    timeFormatDialogOpen: false,
    unitDialogOpen: false,
    nameDialogOpen: false,
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

  handleChange = value => {
    this.setState({
      slideIndex: value,
    })
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

  render() {
    const { userData: { loading, error, user } } = this.props

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
                  <i className="material-icons">lightbulb_outline</i>
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

    const actions = [
      <FlatButton label="Close" onClick={this.props.closeSettingsDialog} />,
    ]

    return (
      <React.Fragment>
        <Dialog
          actions={actions}
          modal={false}
          open={this.props.isOpen}
          onRequestClose={this.props.closeSettingsDialog}
          bodyStyle={{ padding: "0" }}
          repositionOnUpdate={true}
          contentStyle={{ width: "520px" }}
          className="notSelectable"
        >
          <Tabs
            inkBarStyle={{
              background: "ff4081 ",
              height: "3px",
              marginTop: "-3px",
            }}
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab
              icon={<FontIcon className="material-icons">dashboard</FontIcon>}
              label="Interface"
              buttonStyle={{ backgroundColor: "#0057cb" }}
              value={0}
            />
            <Tab
              icon={<i className="material-icons">notifications</i>}
              label="Notifications"
              buttonStyle={{ backgroundColor: "#0057cb" }}
              value={1}
            />
            <Tab
              icon={<FontIcon className="material-icons">account_box</FontIcon>}
              label="Account"
              buttonStyle={{ backgroundColor: "#0057cb" }}
              value={2}
            />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            enableMouseEvents
          >
            <div
              style={{
                overflowY: "auto",
                height: "500px",
              }}
            >
              <div style={listStyles.root}>
                <List style={{ width: "100%" }}>
                  <Subheader>Localization</Subheader>
                  <ListItem
                    primaryText="Change language"
                    secondaryText="English"
                    onClick={this.handleLanguageDialogOpen}
                  />
                  <ListItem
                    primaryText="Change time zone"
                    secondaryText="UTC+01:00"
                    onClick={this.handleTimeDialogOpen}
                  />
                  <ListItem
                    primaryText="Change date and time format"
                    secondaryText="DD/MM/YYYY, 24-hour clock"
                    onClick={this.handleTimeFormatDialogOpen}
                  />
                  <ListItem
                    primaryText="Change unit of measurement"
                    secondaryText="SI, Celsius"
                    onClick={this.handleUnitDialogOpen}
                  />
                  <Subheader>Accessibility</Subheader>
                  <ListItem
                    primaryText="Colorblind mode"
                    secondaryText="Improve color contrast"
                    rightToggle={
                      <Toggle
                        thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                        trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                        rippleStyle={{ color: "#0083ff" }}
                      />
                    }
                  />
                </List>
              </div>
            </div>
            <div
              style={{
                overflowY: "auto",
                height: "500px",
              }}
            >
              <div style={listStyles.root}>
                <List style={{ width: "100%" }}>
                  <Subheader>Lorem Ipsum</Subheader>
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
                  <Subheader>Lorem Ipsum</Subheader>
                  {deviceList}
                </List>
              </div>
            </div>
            <div
              style={{
                overflowY: "auto",
                height: "500px",
              }}
            >
              <List>
                <Subheader>Authentication</Subheader>
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
                <Subheader>Lorem Ipsum</Subheader>
                <ListItem
                  primaryText="Manage roles"
                  secondaryText="Lorem Ipsum"
                />
                <ListItem
                  primaryText="Manage authorizations"
                  secondaryText="Lorem Ipsum"
                />
                <Divider />
                <Subheader>Account management</Subheader>
                <ListItem
                  primaryText="Delete your account"
                  onClick={this.handleDeleteDialogOpen}
                  style={{ color: "#F44336 " }}
                />
              </List>
            </div>
          </SwipeableViews>
        </Dialog>
        <TwoFactorDialog
          isOpen={this.state.twoFactorDialogOpen}
          handleTwoFactorDialogOpen={this.handleTwoFactorDialogOpen}
          handleTwoFactorDialogClose={this.handleTwoFactorDialogClose}
        />
        <DeleteAccountDialog
          deleteOpen={this.state.deleteDialogOpen}
          deleteConfirmedOpen={this.state.deleteConfirmedDialogOpen}
          isDeleteDisabled={this.state.isDeleteDisabled}
          timer={this.state.timer}
          deleteConfirmed={this.deleteConfirmed}
          closeDeleteConfirmed={this.handleDeleteConfirmedClose}
          closeDelete={this.handleDeleteDialogClose}
        />
        <ChangePasswordDialog
          passwordDialogOpen={this.state.passwordDialogOpen}
          handlePasswordDialogClose={this.handlePasswordDialogClose}
        />
        <ChangeEmailDialog
          confirmationDialogOpen={this.state.emailDialogOpen}
          handleEmailDialogClose={this.handleEmailDialogClose}
        />
        <ChangeLanguageDialog
          handleLanguageDialogClose={this.handleLanguageDialogClose}
          languageDialogOpen={this.state.languageDialogOpen}
        />
        <TimeZoneDialog
          handleTimeDialogClose={this.handleTimeDialogClose}
          timeZoneDialogOpen={this.state.timeZoneDialogOpen}
        />
        <TimeFormatDialog
          handleTimeFormatDialogClose={this.handleTimeFormatDialogClose}
          timeFormatDialogOpen={this.state.timeFormatDialogOpen}
        />
        <UnitOfMeasumentDialog
          handleUnitDialogClose={this.handleUnitDialogClose}
          unitDialogOpen={this.state.unitDialogOpen}
        />
        <ChangeNameDialog
          handleNameDialogClose={this.handleNameDialogClose}
          confirmationDialogOpen={this.state.nameDialogOpen}
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
