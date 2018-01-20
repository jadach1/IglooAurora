import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import { Tabs, Tab } from "material-ui/Tabs"
import TextField from "material-ui/TextField"
import FontIcon from "material-ui/FontIcon"
import Toggle from "material-ui/Toggle"
import { List, ListItem } from "material-ui/List"
import Subheader from "material-ui/Subheader"
import Divider from "material-ui/Divider"
import { Step, Stepper, StepButton, StepContent } from "material-ui/Stepper"
import SwipeableViews from "react-swipeable-views"

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
}

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

const deleteDialogContentStyle = {
  width: "360px",
}

const passwordDialogContentStyle = {
  width: "350px",
}

const twoFactorDialogContentStyle = {
  width: "420px",
}

export default class SettingsDialog extends React.Component {
  state = {
    deleteDialogOpen: false,
    passwordDialogOpen: false,
    isDeleteDisabled: true,
    timer: 5,
    labelName: "Delete",
    stepIndex: 0,
    slideIndex: 0,
  }

  handleDeleteDialogOpen = () => {
    this.setState({ deleteDialogOpen: true })
    setTimeout(this.secondsTimer, 1000)
    this.state.timer = 5
    this.setState({ isDeleteDisabled: true })
    this.setState({
      labelName: "Delete (" + this.state.timer + ")",
    })
  }

  handleTwoFactorDialogOpen = () => {
    this.setState({ twoFactorDialogOpen: true })
  }

  handleTwoFactorDialogClose = () => {
    this.setState({ twoFactorDialogOpen: false })
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

  handleChange = value => {
    this.setState({
      slideIndex: value,
    })
  }

  secondsTimer = () => {
    if (this.state.timer > 1) {
      this.setState(({ timer }) => ({ timer: timer - 1 }))
      setTimeout(this.secondsTimer, 1000)
      this.setState({ isDeleteDisabled: true })
      this.setState({
        labelName: "Delete (" + this.state.timer + ")",
      })
    } else {
      this.setState({ isDeleteDisabled: false })
      this.state.timer = 5
      this.setState({
        labelName: "Delete",
      })
    }
  }

  handleNext = () => {
    const { stepIndex } = this.state
    if (stepIndex < 3) {
      this.setState({ stepIndex: stepIndex + 1 })
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 })
    }
  }

  renderStepActions(step) {
    return (
      <div style={{ margin: "12px 0" }}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={this.handleNext}
          style={{ marginRight: 12 }}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    )
  }

  render() {
    const actions = [
      <FlatButton label="Close" onClick={this.props.closeSettingsDialog} />,
    ]

    const deleteDialogActions = [
      <FlatButton
        label="Never mind"
        keyboardFocused={true}
        onClick={this.handleDeleteDialogClose}
      />,
      <RaisedButton
        label={this.state.labelName}
        primary={true}
        buttonStyle={{ backgroundColor: "#F44336" }}
        disabled={this.state.isDeleteDisabled}
        style={{ width: "120px" }}
        disabledLabelColor="#751f19"
      />,
    ]

    const passwordDialogActions = [
      <FlatButton
        label="Never mind"
        keyboardFocused={true}
        onClick={this.handlePasswordDialogClose}
      />,
      <RaisedButton
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    const twoFactorDialogActions = [
      <FlatButton label="Close" onClick={this.handleTwoFactorDialogClose} />,
    ]

    return (
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
            icon={<FontIcon className="material-icons">account_box</FontIcon>}
            label="Account"
            buttonStyle={{ backgroundColor: "#0057cb" }}
            value={1}
          />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div
            style={{
              overflowY: "auto",
              height: "500px",
            }}
          >
            <div style={listStyles.root}>
              <List style={{ width: "100%" }}>
                <Subheader>Controls</Subheader>
                <ListItem
                  primaryText="Enable advanced options for color selector"
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
            <List>
              <Subheader>Authentication</Subheader>
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
              <Subheader>Account management</Subheader>
              <ListItem
                primaryText="Delete your account"
                onClick={this.handleDeleteDialogOpen}
                style={{ color: "#F44336 " }}
              />
            </List>
          </div>
        </SwipeableViews>
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={deleteDialogActions}
          open={this.state.deleteDialogOpen}
          contentStyle={deleteDialogContentStyle}
          onRequestClose={this.handleDeleteDialogClose}
          className="notSelectable"
        >
          Be careful, your data will be erased permanently
        </Dialog>
        <Dialog
          title="Change your password"
          actions={passwordDialogActions}
          open={this.state.passwordDialogOpen}
          contentStyle={passwordDialogContentStyle}
          onRequestClose={this.handlePasswordDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Old Password"
            type="password"
            style={{ width: "100%" }}
          />
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="New Password"
            type="password"
            style={{ width: "100%" }}
          />
        </Dialog>
        <Dialog
          title="Enable two-factor authentication"
          actions={twoFactorDialogActions}
          open={this.state.twoFactorDialogOpen}
          contentStyle={twoFactorDialogContentStyle}
          onRequestClose={this.handleTwoFactorDialogClose}
          className="notSelectable"
        >
          <div style={{ height: 400, margin: "auto" }}>
            <Stepper activeStep={this.state.stepIndex} orientation="vertical">
              <Step>
                <StepButton onClick={() => this.setState({ stepIndex: 0 })}>
                  Type in your password
                </StepButton>
                <StepContent>
                  <TextField
                    floatingLabelShrinkStyle={{ color: "#0083ff" }}
                    underlineFocusStyle={{ borderColor: "#0083ff" }}
                    floatingLabelText="Password"
                    type="password"
                    style={{ width: "100%" }}
                  />
                  {this.renderStepActions(0)}
                </StepContent>
              </Step>
              <Step>
                <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                  Save your recovery codes
                </StepButton>
                <StepContent>
                  <br />
                  aaaaa-11111
                  <br />
                  <br />
                  <FlatButton
                    label="Save"
                    icon={<i class="material-icons">file_download</i>}
                  />
                  <FlatButton
                    label="Copy"
                    icon={<i class="material-icons">content_copy</i>}
                  />
                  <FlatButton
                    label="Print"
                    icon={<i class="material-icons">print</i>}
                  />
                  {this.renderStepActions(1)}
                </StepContent>
              </Step>
              <Step>
                <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                  Scan the barcode on your app
                </StepButton>
                <StepContent>{this.renderStepActions(2)}</StepContent>
              </Step>
              <Step>
                <StepButton onClick={() => this.setState({ stepIndex: 3 })}>
                  Enter the six-digit code
                </StepButton>
                <StepContent>{this.renderStepActions(3)}</StepContent>
              </Step>
            </Stepper>
          </div>
        </Dialog>
      </Dialog>
    )
  }
}
