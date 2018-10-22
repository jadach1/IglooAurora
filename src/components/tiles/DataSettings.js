import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { RadioButton, RadioButtonGroup } from "material-ui"

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class DataSettings extends Component {
  state = {
    unitValue: null,
    visualizationValue: null,
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "300px" }}>Data settings</DialogTitle>
        <div style={{ paddingLeft: "24px" }}>Unit of measurement</div>
        <RadioButtonGroup
          name="unit"
          onChange={(event, value) => this.setState({ unitValue: value })}
          valueSelected={this.state.unitValue}
          style={{
            height: "100%",
          }}
        >
          <RadioButton
            value="celsius"
            label="Celsius (°C)"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="fahrenheit"
            label="Fahrenheit (°F)"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="kelvin"
            label="Kelvin (K)"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
        <br />
        <div style={{ paddingLeft: "24px" }}>Visualization</div>
        <RadioButtonGroup
          name="visualization"
          onChange={(event, value) =>
            this.setState({ visualizationValue: value })
          }
          valueSelected={this.state.visualizationValue}
          style={{
            height: "100%",
          }}
        >
          <RadioButton
            value="number"
            label="Number"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="plot"
            label="Plot"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DataSettings
