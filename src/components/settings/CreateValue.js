import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Icon from "@material-ui/core/Icon"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import MobileStepper from "@material-ui/core/MobileStepper"
import SwipeableViews from "react-swipeable-views"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import CenteredSpinner from "../CenteredSpinner"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

export default class CreateValue extends React.Component {
  state = {
    customName: false,
    activeStep: 0,
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

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          maxHeight={250}
          style={{ width: "300px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        >
          {user.devices.map(device => (
            <MenuItem
              value={user.devices.indexOf(device)}
              primaryText={device.customName}
              style={{ width: "300px" }}
              className="notSelectable"
            />
          ))}
        </DropDownMenu>
      )

    const { activeStep } = this.state

    const maxSteps = 5

    return (
      <React.Fragment>
        <Dialog
          title="Create value"
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
        >
<DialogTitle style={{width:"350px"}}>
	Create value
</DialogTitle>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.activeStep}
            onChangeIndex={this.handleStepChange}
            style={{ height: "220px" }}
          >
            <div style={{ height: "200px" }}>{deviceList}</div>
            <div style={{ height: "200px" }}>
              <TextField
                floatingLabelShrinkStyle={{ color: "#0083ff" }}
                underlineFocusStyle={{ borderColor: "#0083ff" }}
                floatingLabelText="Value name"
                style={{ width: "100%" }}
                onChange={event =>
                  this.setState({ customName: event.target.value })
                }
              />
            </div>
            <div style={{ height: "200px" }}>
              <RadioButtonGroup
                name="Value"
                style={{ marginLeft: "12px", marginTop: "12px" }}
              >
                <RadioButton
                  value="bool"
                  label="Boolean"
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
                  value="color"
                  label="Color"
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
                  value="float"
                  label="Float"
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
                  value="plot"
                  label="Plot"
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
                  value="string"
                  label="String"
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
              <RadioButtonGroup
                name="Permission"
                style={{ marginLeft: "12px", marginTop: "12px" }}
              >
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
              <RadioButtonGroup
                name="Permission"
                style={{ marginLeft: "12px", marginTop: "12px" }}
              >
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
<DialogActions>
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
          disabled={true}
        >
          Create
        </Button>
      </MuiThemeProvider>
</DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
