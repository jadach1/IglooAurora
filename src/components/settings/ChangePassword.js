import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import Snackbar from "material-ui-next/Snackbar"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const passwordDialogContentStyle = {
  width: "350px",
}

export default class ChangePasswordDialog extends React.Component {
  state = {
    pwdSnackOpen: false,
  }

  handlePwdSnackOpen = () => {
    this.setState({
      pwdSnackOpen: true,
    })
    this.props.handlePasswordDialogClose()
  }

  handlePwdSnackClose = () => {
    this.setState({
      pwdSnackOpen: false,
    })
  }

  render() {
    const passwordDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.handlePasswordDialogClose}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.handlePwdSnackOpen}
        >
          Change
        </Button>
      </MuiThemeProvider>,
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
        <Snackbar
          open={this.state.pwdSnackOpen}
          message="You successfully changed your password"
          autoHideDuration={4000}
          onRequestClose={this.handlePwdSnackClose}
          action={[
            <MuiThemeProvider theme={theme}>
              <Button key="close" color="secondary" size="small">
                CLOSE
              </Button>
            </MuiThemeProvider>,
          ]}
        />
      </React.Fragment>
    )
  }
}
