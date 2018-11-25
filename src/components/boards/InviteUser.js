import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class InviteUser extends Component {
  state = { email: "", value: "" }
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={{ width: "350px" }}
        >
          Invite an {this.props.selectedUserType}
        </DialogTitle>
        <MuiThemeProvider theme={theme}>
          <FormControl
            style={{
              width: "calc(100% - 48px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <Input
              id="adornment-email-login"
              placeholder="Email"
              value={this.state.email}
              onChange={event =>
                this.setState({
                  email: event.target.value,
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.props.close()
                  this.props.inviteUser(
                    this.props.selectedUserType.toUpperCase(),
                    this.state.email
                  )
                }
              }}
              endAdornment={
                this.state.email ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ email: "" })}
                      onMouseDown={this.handleMouseDownPassword}
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>
        </MuiThemeProvider>
        <div style={{ height: "100%" }} />
        <br />
        <DialogActions
          className="notSelectable defaultCursor"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        >
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              onClick={() => {
                this.props.close()
                this.props.inviteUser(
                  this.props.selectedUserType.toUpperCase(),
                  this.state.email
                )
              }}
            >
              Invite
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}
