import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import Snackbar from "material-ui/Snackbar"

const mailDialogContentStyle = {
  width: "350px",
}

export default class ChangeMailDialog extends React.Component {
  state = {
    mailSnackOpen: false,
    mailDialogOpen: false,
  }

  handleMailSnackOpen = () => {
    this.setState({
      mailSnackOpen: true,
    })
    this.props.handleMailDialogClose()
  }

  handleMailSnackClose = () => {
    this.setState({
      mailSnackOpen: false,
    })
  }

  render() {
    const confirmationDialogActions = [
      <FlatButton
        label="Never mind"
        keyboardFocused={true}
        onClick={this.props.handlePasswordDialogClose}
      />,
      <RaisedButton
        label="Continue"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]
    const mailDialogActions = [
      <FlatButton
        label="Never mind"
        keyboardFocused={true}
        onClick={this.props.handlePasswordDialogClose}
      />,
      <RaisedButton
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Type your password"
          actions={confirmationDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={mailDialogContentStyle}
          onRequestClose={this.props.handleMailDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
          />
        </Dialog>
        <Dialog
          title="Change your email"
          actions={mailDialogActions}
          open={this.state.mailDialogOpen}
          contentStyle={mailDialogContentStyle}
          onRequestClose={this.props.handleMailDialogClose}
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
          />
        </Dialog>
        <Snackbar
          open={this.state.mailSnackOpen}
          message="You successfully changed your email"
          autoHideDuration={4000}
          onRequestClose={this.handleMailSnackClose}
        />
      </React.Fragment>
    )
  }
}
