import React, { Component } from "react"
import gql from "graphql-tag"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"
import Button from "@material-ui/core/Button"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import { Link } from "react-router-dom"
import ToggleIcon from "material-ui-toggle-icon"
import CenteredSpinner from "../CenteredSpinner"
import Email from "@material-ui/icons/Email"
import Clear from "@material-ui/icons/Clear"
import VpnKey from "@material-ui/icons/VpnKey"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import AccountCircle from "@material-ui/icons/AccountCircle"
import queryString from "querystring"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const veryWeak = createMuiTheme({
  palette: {
    primary: { main: "#d80000" },
  },
})

const weak = createMuiTheme({
  palette: {
    primary: { main: "#ff5e08" },
  },
})

const average = createMuiTheme({
  palette: {
    primary: { main: "#ffa000" },
  },
})

const strong = createMuiTheme({
  palette: {
    primary: { main: "#3ac000" },
  },
})

const veryStrong = createMuiTheme({
  palette: {
    primary: { main: "#2a8a00" },
  },
})

class Signup extends Component {
  constructor() {
    super()

    this.state = {
      passwordScore: null,
      isEmailValid: null,
      isNameValid: true,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
      redirect: false,
      height: 0,
    }

    this.signUp = this.signUp.bind(this)
  }

  async signUp() {
    try {
      this.props.changeEmailError("")
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!, $name: String!) {
            signUp(email: $email, password: $password, name: $name) {
              token
              user {
                environments {
                  id
                }
              }
            }
          }
        `,
        variables: {
          email: this.props.email,
          password: this.props.password,
          name: this.props.name,
        },
      })

      this.props.signIn(
        loginMutation.data.signUp.token,
        loginMutation.data.signUp.user
      )

      this.props.changeName("")
      this.props.changeEmail("")
      this.props.changePassword("")
    } catch (e) {
      this.setState({ showLoading: false })
      if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.props.changeEmailError("This email is already taken")
        this.props.changeLoginEmail(this.props.email)
      } else {
        this.props.changeEmailError("Unexpected error")
      }
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  handleClickCancelEmail = () => {
    this.props.changeEmail("")
    this.setState({ isMailEmpty: true })
  }

  componentDidMount() {
    this.setState({
      passwordScore: zxcvbn(this.props.password, [
        this.props.email,
        this.props.email.split("@")[0],
        this.props.name,
        "igloo",
        "igloo aurora",
        "aurora",
      ]).score,
    })

    if (this.props.email)
      this.setState({
        isEmailValid: EmailValidator.validate(this.props.email),
        isMailEmpty: this.props.email === "",
      })
  }

  render() {
    let scoreText = ""
    let passwordColor = ""
    let passwordTheme = theme

    switch (this.state.passwordScore) {
      case 0:
        scoreText = "Very weak"
        passwordColor = "#d80000"
        passwordTheme = veryWeak
        break

      case 1:
        scoreText = "Weak"
        passwordColor = "#ff5e08"
        passwordTheme = weak
        break

      case 2:
        scoreText = "Average"
        passwordColor = "#ffa000"
        passwordTheme = average
        break

      case 3:
        scoreText = "Strong"
        passwordColor = "#3ac000"
        passwordTheme = strong
        break

      case 4:
        scoreText = "Very strong"
        passwordColor = "#2a8a00"
        passwordTheme = veryStrong
        break

      default:
        scoreText = ""
        passwordTheme = theme
        break
    }

    if (!this.props.password) scoreText = ""

    let customDictionary = [
      this.props.email,
      this.props.email.split("@")[0],
      this.props.name,
      "igloo",
      "igloo aurora",
      "aurora",
    ]

    return (
      <React.Fragment>
        <div
          className="rightSide notSelectable"
          style={{ overflowY: "hidden", padding: "32px 32px 32px 32px" }}
        >
          <div>
            <Typography
              variant="h3"
              gutterBottom
              className="defaultCursor"
              style={{ color: "#0083ff", textAlign: "center" }}
            >
              Sign up
            </Typography>
            <br />
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <AccountCircle style={{ marginBottom: "20px" }} />
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-signup"
                    placeholder="Full name"
                    value={this.props.name}
                    style={{ color: "black" }}
                    onChange={event => {
                      this.props.changeName(event.target.value)
                      this.setState({
                        isNameValid: event.target.value !== "",
                      })
                    }}
                    onKeyPress={event => {
                      if (
                        event.key === "Enter" &&
                        this.props.name &&
                        this.state.isEmailValid &&
                        this.state.passwordScore >= 2
                      ) {
                        this.setState({ showLoading: true })
                        this.signUp()
                      }
                    }}
                    error={!this.state.isNameValid}
                    endAdornment={
                      this.props.name ? (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex="-1"
                            onClick={() => {
                              this.props.changeName("")
                              this.setState({
                                isNameValid: false,
                              })
                            }}
                            style={{ color: "black" }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="name-error-text-signup"
                    style={!this.state.isNameValid ? { color: "#f44336" } : {}}
                  >
                    {!this.state.isNameValid ? "This field is required" : ""}
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
                <Email style={{ marginBottom: "20px" }} />
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-signup"
                    placeholder="Email"
                    value={this.props.email}
                    error={
                      (!this.state.isEmailValid && this.props.email) ||
                      this.props.emailError ||
                      this.state.isMailEmpty
                        ? true
                        : false
                    }
                    style={{ color: "black" }}
                    onChange={event => {
                      this.props.changeEmail(event.target.value)
                      this.props.changeEmailError("")
                      this.setState({
                        isEmailValid: EmailValidator.validate(
                          event.target.value
                        ),
                        isMailEmpty: event.target.value === "",
                      })
                    }}
                    onKeyPress={event => {
                      if (
                        event.key === "Enter" &&
                        this.props.name &&
                        this.state.isEmailValid &&
                        this.state.passwordScore >= 2
                      ) {
                        this.setState({ showLoading: true })
                        this.signUp()
                      }
                    }}
                    endAdornment={
                      this.props.email ? (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex="-1"
                            onClick={this.handleClickCancelEmail}
                            style={{ color: "black" }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="name-error-text-signup"
                    style={
                      (!this.state.isEmailValid && this.props.email) ||
                      this.props.emailError ||
                      this.state.isMailEmpty
                        ? { color: "#f44336" }
                        : {}
                    }
                  >
                    {this.props.emailError ||
                      (!this.state.isEmailValid && this.props.email
                        ? "Enter a valid email"
                        : "")}
                    {this.state.isMailEmpty ? "This field is required" : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <MuiThemeProvider theme={passwordTheme}>
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
                      id="adornment-password-signup"
                      placeholder="Password"
                      color="secondary"
                      style={{ color: "black" }}
                      type={this.state.showPassword ? "text" : "password"}
                      value={this.props.password}
                      error={this.state.isPasswordEmpty ? true : false}
                      onChange={event => {
                        this.props.changePassword(event.target.value)
                        this.setState({
                          passwordScore: zxcvbn(
                            event.target.value,
                            customDictionary
                          ).score,
                          isPasswordEmpty: event.target.value === "",
                        })
                      }}
                      onKeyPress={event => {
                        if (
                          event.key === "Enter" &&
                          this.props.name &&
                          this.state.isEmailValid &&
                          this.state.passwordScore >= 2
                        ) {
                          this.setState({ showLoading: true })
                          this.signUp()
                        }
                      }}
                      endAdornment={
                        this.props.password ? (
                          <InputAdornment position="end">
                            <IconButton
                              tabIndex="-1"
                              onClick={this.handleClickShowPassword}
                              onMouseDown={this.handleMouseDownPassword}
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
                      id="password-error-text-signup"
                      style={
                        this.state.isPasswordEmpty
                          ? { color: "#f44336" }
                          : { color: passwordColor }
                      }
                    >
                      {this.state.isPasswordEmpty
                        ? "This field is required"
                        : scoreText}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </div>
          <div style={{ marginTop: "192px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth={true}
              primary={true}
              onClick={() => {
                this.setState({ showLoading: true })
                this.signUp()
              }}
              style={{ marginBottom: "8px" }}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              disabled={
                !(
                  this.props.name &&
                  this.state.isEmailValid &&
                  this.state.passwordScore >= 2
                ) || this.state.showLoading
              }
            >
              Sign up
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
            {queryString.parse("?" + window.location.href.split("?")[1])
              .from === "accounts" &&
            JSON.parse(localStorage.getItem("accountList"))[0] ? (
              <MuiThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: { main: "#0083ff" },
                  },
                })}
              >
                <Button
                  fullWidth={true}
                  color="primary"
                  disabled={this.state.showLoading}
                  component={Link}
                  to="/accounts"
                >
                  Go back
                </Button>
              </MuiThemeProvider>
            ) : (
              <MuiThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: { main: "#0083ff" },
                  },
                })}
              >
                <Button
                  fullWidth={true}
                  color="primary"
                  disabled={this.state.showLoading}
                  component={Link}
                  to="/login"
                >
                  Log in instead
                </Button>
              </MuiThemeProvider>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Signup
