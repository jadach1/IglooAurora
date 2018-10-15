import React, { Component } from "react"
import gql from "graphql-tag"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"
import {
  CircularProgress,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Input,
  InputAdornment,
  FormControl,
  FormHelperText,
  IconButton,
  Icon,
  Grid,
  Typography,
} from "@material-ui/core"
import { Redirect } from "react-router-dom"

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
          mutation($email: String!, $password: String!, $fullName: String!) {
            SignupUser(
              email: $email
              password: $password
              fullName: $fullName
            ) {
              id
              token
            }
          }
        `,
        variables: {
          email: this.props.email,
          password: this.props.password,
          fullName: this.props.fullName,
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem("email", this.props.email)
      }

      this.props.signIn(loginMutation.data.SignupUser.token)
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

  handleMouseDownPassword = event => {
    event.preventDefault()
  }

  handleClickCancelEmail = () => {
    this.props.changeEmail("")
    this.setState({ isMailEmpty: true })
  }

  componentDidMount() {
    this.setState({
      passwordScore: zxcvbn(
        this.props.password,
        [
          this.props.email,
          this.props.email.split("@")[0],
          this.props.fullName,
          "igloo",
          "igloo aurora",
          "aurora",
        ]
      ).score,
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
      this.props.fullName,
      "igloo",
      "igloo aurora",
      "aurora",
    ]

    return (
      <div className="rightSide notSelectable" style={{ overflowY: "hidden" }}>
        <div>
          <Typography
            variant="display2"
            gutterBottom
            className="defaultCursor"
            style={{ color: "#0083ff", textAlign: "center" }}
          >
            Sign up
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
                <Icon style={{ marginBottom: "20px" }}>account_circle</Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-signup"
                    placeholder="Full name"
                    value={this.props.fullName}
                    onChange={event => {
                      this.props.changeFullName(event.target.value)
                      this.setState({
                        isNameValid: event.target.value !== "",
                      })
                    }
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter" && this.props.fullName &&
                        this.state.isEmailValid &&
                        this.state.passwordScore >= 2) {
                        this.setState({ showLoading: true })
                        this.signUp()
                      }
                    }}
                    error={!this.state.isNameValid}
                    endAdornment={
                      this.props.fullName ? (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex="-1"
                            onClick={() => {
                              this.props.changeFullName("")
                              this.setState({
                                isNameValid: false,
                              })
                            }
                            }
                            onMouseDown={this.handleMouseDownPassword}
                          >
                            <Icon>clear</Icon>
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
                <Icon style={{ marginBottom: "20px" }}>email</Icon>
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
                      if (event.key === "Enter" && this.props.fullName &&
                        this.state.isEmailValid &&
                        this.state.passwordScore >= 2) {
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
                            onMouseDown={this.handleMouseDownPassword}
                          >
                            <Icon>clear</Icon>
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
          </MuiThemeProvider>
          <br />
          <MuiThemeProvider theme={passwordTheme}>
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
                    id="adornment-password-signup"
                    placeholder="Password"
                    color="secondary"
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
                      if (event.key === "Enter" && this.props.fullName &&
                        this.state.isEmailValid &&
                        this.state.passwordScore >= 2) {
                        this.setState({ showLoading: true })
                        this.signUp()
                      }
                    }}
                    endAdornment={
                      this.state.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex="-1"
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
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
                    id="password-error-text-signup"
                    style={
                      this.state.isPasswordEmpty
                        ? { color: "#f44336" }
                        : { color: passwordColor }
                    }
                  >
                    {this.state.isPasswordEmpty ? "This field is required" : scoreText}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </MuiThemeProvider>
        </div>
        <div style={{ marginTop: "189px" }}>
          <MuiThemeProvider theme={theme}>
            <Button
              variant="raised"
              color="primary"
              fullWidth={true}
              primary={true}
              onClick={() => {
                this.setState({ showLoading: true })
                this.signUp()
              }}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              disabled={
                !(
                  this.props.fullName &&
                  this.state.isEmailValid &&
                  this.state.passwordScore >= 2
                ) || this.state.showLoading
              }
            >
              Sign up
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
            Already have an account?{" "}
            <font
              style={{ marginTop: "8px", color: "#0083ff", cursor: "pointer" }}
              onClick={() => this.setState({ redirect: true })}
            >
              Log in!
            </font>
          </Typography>
        </div>
        {this.state.redirect && <Redirect push to="/login" />}
      </div>
    )
  }
}

export default Signup
