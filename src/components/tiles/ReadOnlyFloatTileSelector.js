import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import Snackbar from "material-ui/Snackbar"

const floatTileDialogContentStyle = {
  width: "350px",
}

export default class ReadOnlyFloatTileDialog extends React.Component {
  render() {
    const passwordDialogActions = [
      <FlatButton label="Never mind" />,
      <RaisedButton
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Change your password"
          actions={passwordDialogActions}
          open={this.props.passwordDialogOpen}
          contentStyle={passwordDialogContentStyle}
          onRequestClose={this.props.handlePasswordDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Old Password"
            type="password"
            style={{ width: "100%" }}
          />
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="New Password"
            type="password"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.handlePwdSnackOpen()
            }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
