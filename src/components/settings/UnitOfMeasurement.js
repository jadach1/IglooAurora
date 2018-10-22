import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class UnitOfMeasumentDialog extends React.Component {
  state = {
    value: 1,
  }

  render() {
    return (
      <Dialog
        open={this.props.unitDialogOpen}
        onClose={this.props.handleUnitDialogClose}
        className="notSelectable"
        TransitionComponent={Transition}
        titleClassName="defaultCursor"
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
        >
          Change units of measurement
        </DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Lenght and mass
          <RadioButtonGroup name="lenghtMass" defaultSelected="auto">
            <RadioButton
              value="SI"
              label="SI units"
              style={{
                marginTop: 12,
                marginBottom: 16,
              }}
              onClick={() => this.setState({ menuDisabled: true })}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="Imperial"
              label="Imperial units"
              onClick={() => this.setState({ menuDisabled: false })}
              style={{
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
          </RadioButtonGroup>
          <br />
          Temperature
          <RadioButtonGroup name="temperature" defaultSelected="auto">
            <RadioButton
              value="Celsius"
              label="Celsius"
              style={{
                marginTop: 12,
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="Fahrenheit"
              label="Fahrenheit"
              style={{
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="Kelvin"
              label="Kelvin"
              style={{
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
          </RadioButtonGroup>
        </div>
        <DialogActions style={{ marginRight: "8px" }}>
          <Button
            onClick={this.props.handleUnitDialogClose}
            style={{ marginRight: "0" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
