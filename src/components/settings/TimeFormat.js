import React from "react"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class TimeFormatDialog extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.timeFormatDialogOpen}
        onClose={this.props.handleTimeFormatDialogClose}
        className="notSelectable"
        TransitionComponent={Transition}
        titleClassName="defaultCursor"
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
        >
          Change date and time format
        </DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Date
          <RadioButtonGroup name="date" defaultSelected="dmy">
            <RadioButton
              value="dmy"
              label="DD/MM/YYYY"
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
              value="mdy"
              label="MM/DD/YYYY"
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
              value="ymd"
              label="YYYY/MM/DD"
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
              value="ydm"
              label="YYYY/DD/MM"
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
          Time
          <RadioButtonGroup name="time" defaultSelected="auto">
            <RadioButton
              value="24"
              label="24-hour clock"
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
              value="12"
              label="12-hour clock"
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
            onClick={this.props.handleTimeFormatDialogClose}
            style={{ marginRight: "0" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
