import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import MobileStepper from "material-ui-next/MobileStepper"
import SwipeableViews from "react-swipeable-views"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Input from "material-ui-next/Input"
import { InputLabel } from "material-ui-next"
import { MenuItem } from "material-ui-next"
import { FormControl } from "material-ui-next"
import Select from "material-ui-next/Select"
import CenteredSpinner from "../CenteredSpinner"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

class CreateValue extends React.Component {
  state = {
    customName: false,
    activeStep: 0,
    device: "",
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }

  handleStepChange = activeStep => {
    this.setState({ activeStep })
  }

  handleChange = event => {
    this.setState({ device: event.target.value })
  }

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
        <FormControl>
          <InputLabel>Device</InputLabel>
          <Select
            value={this.state.device}
            onChange={this.handleChange}
            input={<Input name="Device" />}
            autoWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {user.devices.map(device => (
              <MenuItem value={device.id}>{device.customName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )

    const { activeStep } = this.state

    const maxSteps = 5

    const actions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          label="Change"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.props.close}
          disabled={!this.state.customName}
        >
          Create
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Create value"
          actions={actions}
          open={this.props.open}
          contentStyle={{ width: "350px" }}
          onRequestClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
          bodyStyle={{
            paddingBottom: "0px",
          }}
        >
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.activeStep}
            onChangeIndex={this.handleStepChange}
            enableMouseEvents
            style={{ height: "200px" }}
          >
            <div style={{ height: "200px" }}>{deviceList}</div>
            <div style={{ height: "200px" }}>
              <TextField
                floatingLabelShrinkStyle={{ color: "#0083ff" }}
                underlineFocusStyle={{ borderColor: "#0083ff" }}
                floatingLabelText="Value name"
                style={{ width: "100%" }}
                onKeyPress={event => {
                  if (event.key === "Enter") this.openNameDialog()
                }}
                onChange={event =>
                  this.setState({ customName: event.target.value })
                }
              />
            </div>
            <div style={{ height: "200px" }}>
              <RadioButtonGroup name="Permission">
                <RadioButton
                  value="readOnly"
                  label="Read only"
                  style={{
                    marginBottom: 16,
                  }}
                  rippleStyle={{ color: "#0083ff" }}
                  checkedIcon={
                    <Icon style={{ color: "#0083ff" }}>
                      radio_button_checked
                    </Icon>
                  }
                  uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                />
                <RadioButton
                  value="readWrite"
                  label="Read write"
                  style={{
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                  rippleStyle={{ color: "#0083ff" }}
                  checkedIcon={
                    <Icon style={{ color: "#0083ff" }}>
                      radio_button_checked
                    </Icon>
                  }
                  uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                />
              </RadioButtonGroup>
            </div>
            <div style={{ height: "200px" }}>
              <RadioButtonGroup name="Permission">
                <RadioButton
                  value="visible"
                  label="Visible"
                  style={{
                    marginBottom: 16,
                  }}
                  rippleStyle={{ color: "#0083ff" }}
                  checkedIcon={
                    <Icon style={{ color: "#0083ff" }}>
                      radio_button_checked
                    </Icon>
                  }
                  uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                />
                <RadioButton
                  value="hidden"
                  label="Hidden"
                  style={{
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                  rippleStyle={{ color: "#0083ff" }}
                  checkedIcon={
                    <Icon style={{ color: "#0083ff" }}>
                      radio_button_checked
                    </Icon>
                  }
                  uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                />
                <RadioButton
                  value="invisible"
                  label="Invisible"
                  style={{
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                  rippleStyle={{ color: "#0083ff" }}
                  checkedIcon={
                    <Icon style={{ color: "#0083ff" }}>
                      radio_button_checked
                    </Icon>
                  }
                  uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                />
              </RadioButtonGroup>
            </div>
            <div style={{ height: "200px" }}>Select a value</div>
          </SwipeableViews>
          <MuiThemeProvider theme={theme}>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              style={{ backgroundColor: "#ffffff" }}
              nextButton={
                <Button
                  size="small"
                  onClick={this.handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  <Icon>keyboard_arrow_right</Icon>
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={this.handleBack}
                  disabled={activeStep === 0}
                >
                  <Icon>keyboard_arrow_left</Icon>
                  Back
                </Button>
              }
            />
          </MuiThemeProvider>
        </Dialog>
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
)(CreateValue)
