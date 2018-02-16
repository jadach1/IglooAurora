import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"

export default class TimeFormatDialog extends React.Component {
  render() {
    const timeFormatActions = [
      <FlatButton
        label="Never mind"
        onClick={this.props.handleTimeFormatDialogClose}
      />,
      <RaisedButton
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    return (
      <Dialog
        title="Change time format"
        actions={timeFormatActions}
        open={this.props.timeFormatDialogOpen}
        onRequestClose={this.props.handleTimeFormatDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
      />
    )
  }
}
