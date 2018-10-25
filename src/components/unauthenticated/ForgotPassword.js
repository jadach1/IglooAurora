import React from "react"
import * as EmailValidator from "email-validator"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"

const MOBILE_WIDTH = 500

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ForgotPassword extends React.Component {
  state = {
    email: this.props.email,
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          titleClassName="defaultCursor"
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
          >
            Recover your password
          </DialogTitle>
          <MuiThemeProvider theme={theme}>
            <div
              style={
                window.innerWidth > MOBILE_WIDTH
                  ? {
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      width: "350px",
                    }
                  : { paddingLeft: "24px", paddingRight: "24px" }
              }
            >
              <div className="defaultCursor">
                Enter your email address and we will send you a link to reset
                your password
              </div>
              <br />
              <FormControl style={{ width: "100%" }}>
                <Input
                  id="adornment-name-login"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={event =>
                    this.setState({
                      customName: event.target.value,
                    })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") this.rename()
                  }}
                  endAdornment={
                    this.state.customName ? (
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
            </div>
            <br />
          </MuiThemeProvider>
          <div style={{ height: "100%" }} />
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <MuiThemeProvider theme={theme}>
              <Button
                variant="raised"
                color="primary"
                disabled={!EmailValidator.validate(this.state.email)}
                onClick={() => {
                  this.props.recover(this.state.email)
                  this.props.close()
                }}
              >
                Recover
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
