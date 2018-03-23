import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import Snackbar from "material-ui/Snackbar"
import { List, ListItem } from "material-ui/List"
import IconButton from "material-ui/IconButton"

const mailDialogContentStyle = {
  width: "350px",
}

export default class ChangeMailDialog extends React.Component {
  state = {
    mailSnackOpen: false,
    mailDialogOpen: false,
  }

  openMailDialog = () => {
    this.setState({ mailDialogOpen: true })
    this.props.handleEmailDialogClose()
  }

  closeMailDialog = () => {
    this.setState({ mailDialogOpen: false })
  }

  handleMailSnackOpen = () => {
    this.setState({
      mailSnackOpen: true,
    })
    this.closeMailDialog()
  }

  handleMailSnackClose = () => {
    this.setState({
      mailSnackOpen: false,
    })
  }

  render() {
    const confirmationDialogActions = [
      <Button onClick={this.props.handleEmailDialogClose}>Never Mind</Button>,
      <Button variant="raised" color="primary" onClick={this.openMailDialog}>
        Proceed
      </Button>,
    ]
    const mailDialogActions = [
      <Button onClick={this.closeMailDialog}>Close</Button>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Type your password"
          actions={confirmationDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={mailDialogContentStyle}
          onRequestClose={this.props.handleEmailDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openMailDialog()
            }}
          />
        </Dialog>
        <Dialog
          title="Manage your emails"
          actions={mailDialogActions}
          open={this.state.mailDialogOpen}
          contentStyle={mailDialogContentStyle}
          onRequestClose={this.closeMailDialog}
          className="notSelectable"
          bodyStyle={{
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "0px",
          }}
        >
          <List>
            <ListItem
              primaryText="showcase@igloo.io"
              leftIcon={<i class="material-icons">mail_outline</i>}
              rightIconButton={
                <IconButton>
                  <i class="material-icons">delete</i>
                </IconButton>
              }
            />
            <ListItem
              primaryText="Add a new email"
              leftIcon={<i class="material-icons">add</i>}
            />
          </List>
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
