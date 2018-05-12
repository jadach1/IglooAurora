import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import Icon from "material-ui-next/Icon"

var moment = require("moment-timezone")

let timeZones = moment.tz
  .names()
  .map(
    timeZone =>
      timeZone.split("/")[1]
        ? "(UTC" +
          moment.tz(timeZone).format("Z") +
          ") " +
          timeZone.split("/")[1].replace(/_/g, " ")
        : ""
  )
  .sort()
  .filter(item => item !== "" && !item.includes("GMT"))

let negativeOffset = timeZones.filter(item => item.includes("UTC-")).reverse()
let positiveOffset = timeZones.filter(item => item.includes("UTC+"))

let sortedTimeZones = negativeOffset.concat(positiveOffset)

function cleanArray(arr) {
  let unique_array = []
  for (let i = 0; i < arr.length; i++) {
    if (unique_array.indexOf(arr[i]) === -1) {
      unique_array.push(arr[i])
    }
  }
  return unique_array
}

export default class TimeZoneDialog extends React.Component {
  state = {
    value: moment.tz.guess(),
    menuDisabled: true,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const timeZoneActions = [
      <Button onClick={this.props.handleTimeDialogClose}>Close</Button>,
    ]

    return (
      <Dialog
        title="Change time zone"
        actions={timeZoneActions}
        open={this.props.timeZoneDialogOpen}
        onRequestClose={this.props.handleTimeDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          paddingBottom: "0px",
        }}
      >
        <RadioButtonGroup name="Time Zone">
          <RadioButton
            value="auto"
            label={
              "Auto: (UTC" +
              moment.tz(moment.tz.guess()).format("Z") +
              ") " +
              moment.tz.guess().split("/")[1]
            }
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
            value="manual"
            label="Manual"
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
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.state.menuDisabled}
          maxHeight={250}
          style={{ width: "302px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        >
          {cleanArray(sortedTimeZones).map(timeZone => (
            <MenuItem value={timeZone} primaryText={timeZone} />
          ))}
        </DropDownMenu>
        <br />
      </Dialog>
    )
  }
}
