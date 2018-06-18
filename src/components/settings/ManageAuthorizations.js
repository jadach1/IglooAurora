import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import Icon from "material-ui-next/Icon"

export default class GetPermanentToken extends React.Component {
  render() {
    const timeFormatActions = [<Button>Close</Button>]

    return (
      <Dialog
        title="Change date and time format"
        actions={timeFormatActions}
        open={this.props.timeFormatDialogOpen}
        onRequestClose={this.props.handleTimeFormatDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          paddingBottom: "0px",
        }}
      >
        Date
        <RadioButtonGroup name="date" defaultSelected="auto">
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
      </Dialog>
    )
  }
}
