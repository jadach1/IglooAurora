import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import Snackbar from "material-ui-next/Snackbar"
import { List, ListItem } from "material-ui/List"
import IconButton from "material-ui-next/IconButton"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

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
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={this.props.handleEmailDialogClose}
          style={{ marginRight: "4px" }}
        >
          Never Mind
        </Button>
        <Button variant="raised" color="primary" onClick={this.openMailDialog}>
          Proceed
        </Button>
      </MuiThemeProvider>,
    ]
    const mailDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.closeMailDialog}>Close</Button>
      </MuiThemeProvider>,
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
          titleClassName="notSelectable defaultCursor"
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
          titleClassName="notSelectable defaultCursor"
          bodyStyle={{
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "0px",
          }}
        >
          <List>
            <ListItem
              primaryText="showcase@igloo.io"
              leftIcon={<Icon>mail_outline</Icon>}
              rightIconButton={
                <IconButton>
                  <Icon>delete</Icon>
                </IconButton>
              }
            />
            <ListItem
              primaryText="Add a new email"
              leftIcon={<Icon>add</Icon>}
            />
          </List>
        </Dialog>
        <Snackbar
          open={this.state.mailSnackOpen}
          message="You successfully changed your email"
          autoHideDuration={4000}
          onRequestClose={this.handleMailSnackClose}
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
