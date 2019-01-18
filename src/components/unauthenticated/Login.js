import React, { Component } from "react"
import gql from "graphql-tag"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputAdornment from "@material-ui/core/InputAdornment"
import Input from "@material-ui/core/Input"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import IconButton from "@material-ui/core/IconButton"
import ForgotPassword from "./ForgotPassword"
import * as EmailValidator from "email-validator"
import ToggleIcon from "material-ui-toggle-icon"
import CenteredSpinner from "../CenteredSpinner"
import { Link } from "react-router-dom"
import MUILink from "@material-ui/core/Link"
import Email from "@material-ui/icons/Email"
import Clear from "@material-ui/icons/Clear"
import VpnKey from "@material-ui/icons/VpnKey"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Visibility from "@material-ui/icons/Visibility"

class Login extends Component {
  constructor() {
    super()

    this.state = {
      recoveryError: "",
      forgotPasswordOpen: false,
      isMailEmpty: false,
      isPasswordEmpty: false,
      keepLoggedIn:
        typeof Storage !== "undefined"
          ? localStorage.getItem("keepLoggedIn") === "true"
          : true,
      showLoading: false,
      redirect: false,
    }

    this.signIn = this.signIn.bind(this)
    this.recover = this.recover.bind(this)
  }

  async signIn() {
    try {
      this.props.changePasswordError("")
      this.props.changeEmailError("")
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            logIn(email: $email, password: $password) {
              token
            }
          }
        `,
        variables: {
          email: this.props.email,
          password: this.props.password,
        },
      })

      if (this.props.email !== "undefined" && typeof Storage !== "undefined") {
        localStorage.setItem("email", this.props.email)
      }

      this.props.signIn(loginMutation.data.logIn.token, this.state.keepLoggedIn)

      this.props.changePassword("")
    } catch (e) {
      this.setState({ showLoading: false })

      if (e.message === "GraphQL error: Wrong password") {
        this.props.changePasswordError("Wrong password")
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.props.changeEmailError("This account doesn't exist")
        this.props.changeSignupEmail(this.props.email)
      } else {
        this.props.changeEmailError("Unexpected error")
      }
    }
  }

  async recover(recoveryEmail) {
    try {
      this.setState({ recoveryError: "" })
      await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!) {
            sendPasswordRecoveryEmail(email: $email)
          }
        `,
        variables: {
          email: recoveryEmail,
        },
      })
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.setState({
          recoveryError: "This account does not exist",
        })
      } else {
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="rightSide notSelectable"
          style={{ overflowY: "hidden" }}
        >
          <div>
            <Typography
              variant="h3"
              gutterBottom
              className="defaultCursor"
              style={{ color: "#0083ff", textAlign: "center" }}
            >
              Log in
            </Typography>
            <br />
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <Email style={{ marginBottom: "20px" }} />
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="desktop-login-email"
                    placeholder="Email"
                    value={this.props.email}
                    style={{ color: "black" }}
                    onChange={event => {
                      this.props.changeEmail(event.target.value)
                      this.setState({
                        isMailEmpty: event.target.value === "",
                      })
                    }}
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        if (
                          EmailValidator.validate(this.props.email) &&
                          this.props.password
                        ) {
                          this.signIn()
                          this.setState({ showLoading: true })
                        }
                      }
                    }}
                    error={
                      this.props.emailError || this.state.isMailEmpty
                        ? true
                        : false
                    }
                    endAdornment={
                      this.props.email ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              this.props.changeEmail("")
                              this.setState({ isMailEmpty: true })
                            }}
                            tabIndex="-1"
                            style={{ color: "black" }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="name-error-text-login"
                    style={
                      this.props.emailError || this.state.isMailEmpty
                        ? { color: "#f44336" }
                        : {}
                    }
                  >
                    {this.state.isMailEmpty
                      ? "This field is required"
                      : this.props.emailError}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <VpnKey style={{ marginBottom: "20px" }} />
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-password-login"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.props.password}
                    placeholder="Password"
                    style={{ color: "black" }}
                    onChange={event => {
                      this.props.changePassword(event.target.value)
                      this.props.changePasswordError("")
                      this.setState({
                        isPasswordEmpty: event.target.value === "",
                      })
                    }}
                    error={
                      this.props.passwordError || this.state.isPasswordEmpty
                        ? true
                        : false
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        if (
                          EmailValidator.validate(this.props.email) &&
                          this.props.password
                        ) {
                          this.signIn()
                          this.setState({ showLoading: true })
                        }
                      }
                    }}
                    endAdornment={
                      this.props.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              this.setState({
                                showPassword: !this.state.showPassword,
                              })
                            }
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                            style={{ color: "black" }}
                          >
                            {/* fix for ToggleIcon glitch on Edge */}
                            {document.documentMode ||
                            /Edge/.test(navigator.userAgent) ? (
                              this.state.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )
                            ) : (
                              <ToggleIcon
                                on={this.state.showPassword || false}
                                onIcon={<VisibilityOff />}
                                offIcon={<Visibility />}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="password-error-text-login"
                    style={
                      this.props.passwordError || this.state.isPasswordEmpty
                        ? { color: "#f44336" }
                        : {}
                    }
                  >
                    {this.state.isPasswordEmpty
                      ? "This field is required"
                      : this.props.passwordError}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <FormControlLabel
              style={{
                marginLeft: "-92px",
                textAlign: "left",
                marginRight: "0px",
              }}
              control={
                <Checkbox
                  onChange={event =>
                    this.setState({ keepLoggedIn: event.target.checked })
                  }
                  checked={this.state.keepLoggedIn}
                  color="primary"
                />
              }
              label={
                <Typography variant="subtitle1" style={{ paddingLeft: "4px" }}>
                  Keep me logged in
                </Typography>
              }
              className="notSelectable"
            />
          </div>
          <div style={{ marginTop: "176px" }}>
            <div style={{ textAlign: "right" }}>
              <MUILink
                component="button"
                variant="subtitle1"
                style={{
                  color: "#0083ff",
                  cursor: "pointer",
                  marginBottom: "8px",
                  width: "130px",
                  marginRight: "0px",
                  marginLeft: "auto",
                }}
                onClick={() => {
                  this.setState({ forgotPasswordOpen: true })
                }}
              >
                Forgot password?
              </MUILink>
            </div>
            <Button
              variant="contained"
              primary={true}
              fullWidth={true}
              onClick={() => {
                this.setState({ showLoading: true })
                this.signIn()
              }}
              color="primary"
              disabled={
                !(
                  EmailValidator.validate(this.props.email) &&
                  this.props.password
                ) || this.state.showLoading
              }
            >
              Log in
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
            <Typography variant="subtitle1" style={{ marginTop: "8px" }}>
              No account yet?{" "}
              <font
                style={{
                  marginTop: "8px",
                }}
              >
                <MUILink
                  component={Link}
                  to="/signup"
                  style={{
                    color: "#0083ff",
                  }}
                >
                  Sign up!
                </MUILink>
              </font>
            </Typography>
          </div>
        </div>
        <ForgotPassword
          recover={email => this.recover(email)}
          open={this.state.forgotPasswordOpen}
          close={() => this.setState({ forgotPasswordOpen: false })}
          email={this.props.email}
        />
      </React.Fragment>
    )
  }
}

export default Login
