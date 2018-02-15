import React from "react"
import Dialog from "material-ui/Dialog"
import Checkbox from "material-ui/Checkbox"
import { List, ListItem } from "material-ui/List"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"

export default class TimeZoneDialog extends React.Component {
  state = {
    value: 1,
    menuDisabled: true,
  }

  render() {
    const timeZoneActions = [
      <FlatButton
        label="Never mind"
        onClick={this.props.handleTimeDialogClose}
      />,
      <RaisedButton
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
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
      >
        <RadioButtonGroup name="Time Zone" defaultSelected="auto">
          <RadioButton
            value="auto"
            label="Auto"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            onClick={() => this.setState({ menuDisabled: true })}
          />
          <RadioButton
            value="manual"
            label="Manual"
            onClick={() => this.setState({ menuDisabled: false })}
            style={{
              marginBottom: 16,
            }}
          />
        </RadioButtonGroup>
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.state.menuDisabled}
        >
          <MenuItem value={1} primaryText="UTC" />
          <MenuItem value={2} primaryText="UTC+01:00" />
          <MenuItem value={3} primaryText="UTC+02:00" />
        </DropDownMenu>
      </Dialog>
    )
  }
}
