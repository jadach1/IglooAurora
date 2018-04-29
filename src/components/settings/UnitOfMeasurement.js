import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Icon from "material-ui-next/Icon"

export default class UnitOfMeasumentDialog extends React.Component {
  state = {
    value: 1,
  }

  render() {
    const unitActions = [
      <Button onClick={this.props.handleUnitDialogClose}>Close</Button>,
    ]

    return (
      <Dialog
        title="Change units of measurement"
        actions={unitActions}
        open={this.props.unitDialogOpen}
        onRequestClose={this.props.handleUnitDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          paddingBottom: "0px",
        }}
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
      </Dialog>
    )
  }
}
