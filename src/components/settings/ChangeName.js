import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import Snackbar from "material-ui/Snackbar"
import { List, ListItem } from "material-ui/List"

const nameDialogContentStyle = {
  width: "350px",
}

export default class ChangeNameDialog extends React.Component {
  state = {
    nameSnackOpen: false,
    nameDialogOpen: false,
  }

  openNameDialog = () => {
    this.setState({ nameDialogOpen: true })
    this.props.handleNameDialogClose()
  }

  closeNameDialog = () => {
    this.setState({ nameDialogOpen: false })
  }

  handleNameSnackOpen = () => {
    this.setState({
      nameSnackOpen: true,
    })
    this.closeNameDialog()
  }

  handleNameSnackClose = () => {
    this.setState({
      nameSnackOpen: false,
    })
  }

  render() {
    const confirmationDialogActions = [
      <Button onClick={this.props.handleNameDialogClose}>Never mind</Button>,
      <Button
        variant="raised"
        color="primary"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
        onClick={this.openNameDialog}
      >
        Proceed
      </Button>,
    ]
    const nameDialogActions = [
      <Button onClick={this.closeNameDialog}>Never mind</Button>,
      <Button
        variant="raised"
        color="primary"
        label="Change"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
        onClick={this.handleNameSnackOpen}
      >
        Change
      </Button>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Type your password"
          actions={confirmationDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={nameDialogContentStyle}
          onRequestClose={this.props.handleNameDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openNameDialog()
            }}
          />
        </Dialog>
        <Dialog
          title="Change your user name"
          actions={nameDialogActions}
          open={this.state.nameDialogOpen}
          contentStyle={nameDialogContentStyle}
          onRequestClose={this.closeNameDialog}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            value="UserName1"
            floatingLabelText="User name"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openNameDialog()
            }}
          />
        </Dialog>
        <Snackbar
          open={this.state.nameSnackOpen}
          message="You successfully changed your user name"
          autoHideDuration={4000}
          onRequestClose={this.handleNameSnackClose}
        />
      </React.Fragment>
    )
  }
}
