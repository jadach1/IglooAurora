import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangePasswordDialog extends React.Component {
  state = {
    showPassword: false,
  }

  render() {
    return (
      <Dialog
        open={this.props.passwordDialogOpen}
        onClose={this.props.handlePasswordDialogClose}
        className="notSelectable"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>
          Change your password
        </DialogTitle>
        <div
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            height: "100%",
          }}
        >
          <MuiThemeProvider theme={theme}>
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                placeholder="Old password"
                onChange={event =>
                  this.setState({
                    password: event.target.value,
                    passwordError: "",
                    isPasswordEmpty: event.target.value === "",
                  })
                }
                error={
                  this.state.passwordError || this.state.isPasswordEmpty
                    ? true
                    : false
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.openMailDialog()
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                      >
                        {this.state.showPassword ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
            <br />
            <br />
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                placeholder="New password"
                onChange={event =>
                  this.setState({
                    password: event.target.value,
                    passwordError: "",
                    isPasswordEmpty: event.target.value === "",
                  })
                }
                error={
                  this.state.passwordError || this.state.isPasswordEmpty
                    ? true
                    : false
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.openMailDialog()
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                      >
                        {this.state.showPassword ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
            <br />
            <br />
          </MuiThemeProvider>
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button
              onClick={this.props.handlePasswordDialogClose}
              style={{ marginRight: "4px" }}
            >
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
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}
