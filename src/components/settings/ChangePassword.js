import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"
import ToggleIcon from "material-ui-toggle-icon"

const MOBILE_WIDTH = 600

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
        fullWidth
        maxWidth="xs"
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
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showPassword ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showPassword || false}
                          onIcon={<Icon>visibility_off</Icon>}
                          offIcon={<Icon>visibility</Icon>}
                        />
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
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showNewPassword ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showNewPassword || false}
                          onIcon={<Icon>visibility_off</Icon>}
                          offIcon={<Icon>visibility</Icon>}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>
          <br />
          <br />
        </div>
        <DialogActions>
          <Button
            onClick={this.props.handlePasswordDialogClose}
            style={{ marginRight: "4px" }}
          >
            Never mind
          </Button>
          <Button
            variant="contained"
            color="primary"
            primary={true}
            buttonStyle={{ backgroundColor: "#0083ff" }}
            onClick={this.handlePwdSnackOpen}
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
