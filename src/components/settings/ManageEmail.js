import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "@material-ui/core/Button"
import TextField from "material-ui/TextField"
import Snackbar from "@material-ui/core/Snackbar"
import { List, ListItem } from "material-ui/List"
import IconButton from "@material-ui/core/IconButton"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Icon from "@material-ui/core/Icon"

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
       
        <Button
          onClick={this.props.handleEmailDialogClose}
          style={{ marginRight: "4px" }}
        >
          Never mind
        </Button>
        <Button variant="contained" color="primary" onClick={this.openMailDialog}>
          Proceed
        </Button>
       ,
    ]
    const mailDialogActions = [
       
        <Button onClick={this.closeMailDialog}>Close</Button>
       ,
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
          fullWidth
          maxWidth="xs"
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
          fullWidth
          maxWidth="xs"
          bodyStyle={{
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "0px",
          }}
        >
          <List >
            <ListItem
              primaryText="showcase@igloo.io"
              leftIcon={<Icon>mail_outline</Icon>}
              rightIconButton={
                <IconButton 
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }>
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
             
              <Button key="close" color="secondary" size="small">
                CLOSE
              </Button>
             ,
          ]}
        />
      </React.Fragment>
    )
  }
}
