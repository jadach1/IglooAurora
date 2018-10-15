import React, { Component } from "react"
import gql from "graphql-tag"
import {
  FormControl,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  Input,
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Icon,
  IconButton,
} from "@material-ui/core"
import ForgotPassword from "./ForgotPassword"
import * as EmailValidator from "email-validator"
import { Redirect } from "react-router-dom"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

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
            AuthenticateUser(email: $email, password: $password) {
              id
              token
              user {
                boardsCount
                boards {
                  id
                }
              }
            }
          }
        `,
        variables: {
          email: this.props.email,
          password: this.props.password,
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem("email", this.props.email)
      }

      this.props.setBoards(
        loginMutation.data.AuthenticateUser.user.boardsCount,
        loginMutation.data.AuthenticateUser.user.boardsCount === 1
          ? loginMutation.data.AuthenticateUser.user.boards[0].id
          : ""
      )

      this.props.signIn(
        loginMutation.data.AuthenticateUser.token,
        this.state.keepLoggedIn
      )
    } catch (e) {
      this.setState({ showLoading: false })

      if (e.message === "GraphQL error: Wrong password") {
        this.props.changePasswordError("Wrong password")
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
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
            SendPasswordRecoveryEmail(email: $email)
          }
        `,
        variables: {
          email: recoveryEmail,
        },
      })
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
      ) {
        this.setState({
          recoveryError: "This account does not exist",
        })
      } else {
      }
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  handleMouseDownPassword = event => {
    event.preventDefault()
  }

  handleClickCancelEmail = () => {
    this.props.changeEmail("")
    this.setState({ isMailEmpty: true })
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
              variant="display2"
              gutterBottom
              className="defaultCursor"
              style={{ color: "#0083ff", textAlign: "center" }}
            >
              Log in
            </Typography>
            <br />
            <MuiThemeProvider theme={theme}>
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{ width: "100%" }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon style={{ marginBottom: "20px" }}>email</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-email-login"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={event => {
                        this.props.changeEmail(event.target.value)
                        this.setState({
                          isMailEmpty: event.target.value === "",
                        })
                      }
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
                      error={
                        this.props.emailError || this.state.isMailEmpty
                          ? true
                          : false
                      }
                      endAdornment={
                        this.props.email ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={this.handleClickCancelEmail}
                              onMouseDown={this.handleMouseDownPassword}
                              tabIndex="-1"
                            >
                              <Icon>clear</Icon>
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
                  <Icon style={{ marginBottom: "20px" }}>vpn_key</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-password-login"
                      type={this.state.showPassword ? "text" : "password"}
                      value={this.props.password}
                      placeholder="Password"
                      onChange={event => {
                        this.props.changePassword(event.target.value)
                        this.props.changePasswordError("")
                        this.setState({
                          isPasswordEmpty: event.target.value === "",
                        })
                      }
                      }
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
                    <FormHelperText
                      id="password-error-text-login"
                      style={
                        this.props.passwordError || this.state.isPasswordEmpty
                          ? { color: "#f44336" }
                          : {}
                      }
                    >
                      {this.state.isPasswordEmpty ? "This field is required" : this.props.passwordError}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <FormControlLabel
                style={{
                  marginLeft: "-94px",
                  textAlign: "left",
                  marginRight: "0px",
                }}
                control={
                  <MuiThemeProvider
                    theme={createMuiTheme({
                      palette: {
                        secondary: { main: "#0083ff" },
                      },
                    })}
                  >
                    <Checkbox
                      onChange={event =>
                        this.setState({ keepLoggedIn: event.target.checked })
                      }
                      checked={this.state.keepLoggedIn}
                    />
                  </MuiThemeProvider>
                }
                label={
                  <Typography
                    variant="subheading"
                    style={{ paddingLeft: "4px" }}
                  >
                    Keep me logged in
                  </Typography>
                }
              />
            </MuiThemeProvider>
          </div>
          <div style={{ marginTop: "179px" }}>
            <div style={{ textAlign: "right" }}>
              <Typography
                variant="subheading"
                style={{
                  color: "#0083ff",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
                onClick={() => {
                  this.setState({ forgotPasswordOpen: true })
                }}
              >
                Forgot password?
              </Typography>
            </div>
            <MuiThemeProvider theme={theme}>
              <Button
                variant="raised"
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
                {this.state.showLoading && (
                  <MuiThemeProvider
                    theme={createMuiTheme({
                      palette: {
                        primary: { main: "#0083ff" },
                      },
                    })}
                  >
                    <CircularProgress
                      size={24}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: -12,
                        marginLeft: -12,
                      }}
                    />
                  </MuiThemeProvider>
                )}
              </Button>
            </MuiThemeProvider>
            <Typography variant="subheading" style={{ marginTop: "8px" }}>
              No account yet?{" "}
              <font
                style={{
                  marginTop: "8px",
                  color: "#0083ff",
                  cursor: "pointer",
                }}
                onClick={() => this.setState({ redirect: true })}
              >
                Sign up!
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
        {this.state.redirect && <Redirect push to="/signup" />}
      </React.Fragment>
    )
  }
}

export default Login
