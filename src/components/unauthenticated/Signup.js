import React, { Component } from "react"
import gql from "graphql-tag"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"
import Button from "@material-ui/core/Button"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import { Link } from "react-router-dom"
import ToggleIcon from "material-ui-toggle-icon"
import CenteredSpinner from "../CenteredSpinner"
import Clear from "@material-ui/icons/Clear"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import querystringify from "querystringify"
import logo from "../../styles/assets/logo.svg"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import SvgIcon from "@material-ui/core/SvgIcon"
import Fingerprint from "@material-ui/icons/Fingerprint"
import Mail from "@material-ui/icons/Mail"
import TextField from "@material-ui/core/TextField"

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

export default class Signup extends Component {
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
      confirmPassword: "",
    }

    this.signUp = this.signUp.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight })
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
                id
                email
                name
                profileIconColor
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

    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
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
      <div
        className="rightSide notSelectable"
        style={
          this.props.mobile
            ? {
                maxWidth: "448px",
                marginLeft: "auto",
                marginRight: "auto",
                paddingLeft: "32px",
                paddingRight: "32px",
              }
            : {}
        }
      >
        {this.props.mobile && (
          <img
            src={logo}
            alt="Igloo logo"
            className="notSelectable nonDraggable"
            draggable="false"
            style={
              this.state.height >= 690
                ? {
                    width: "192px",
                    paddingTop: "72px",
                    marginBottom: "72px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
                : {
                    width: "144px",
                    paddingTop: "48px",
                    marginBottom: "48px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
            }
            onClick={() =>
              this.setState(oldState => ({
                tapCounter: oldState.tapCounter + 1,
              }))
            }
          />
        )}
        {!this.state.showSignupPassword ? (
          !this.state.showPasswordLess ? (
            <React.Fragment>
              <Typography
                variant="h3"
                gutterBottom
                className="defaultCursor"
                style={
                  this.props.mobile
                    ? {
                        color: "white",
                        textAlign: "center",
                        marginBottom: "32px",
                        marginTop: "32px",
                      }
                    : {
                        color: "#0083ff",
                        textAlign: "center",
                        marginBottom: "32px",
                        marginTop: "32px",
                      }
                }
              >
                Sign up
              </Typography>
              <div style={{ margin: "0 32px" }}>
                <TextField
                  variant="outlined"
                  id="desktop-signup-name"
                  label="Name"
                  value={this.props.name}
                  style={{
                    color: "black",
                    width: "100%",
                    marginBottom: "16px",
                  }}
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
                  helperText={
                    !this.state.isNameValid ? "This field is required" : " "
                  }
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
                <br />
                <TextField
                  variant="outlined"
                  id="desktop-email-signup"
                  label="Email"
                  value={this.props.email}
                  error={
                    (!this.state.isEmailValid && this.props.email) ||
                    this.props.emailError ||
                    this.state.isMailEmpty
                      ? true
                      : false
                  }
                  style={{
                    color: "black",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                  onChange={event => {
                    this.props.changeEmail(event.target.value)
                    this.props.changeEmailError("")
                    this.setState({
                      isEmailValid: EmailValidator.validate(event.target.value),
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
                  helperText={
                    this.props.emailError ||
                    (!this.state.isEmailValid && this.props.email
                      ? "Enter a valid email"
                      : " ")
                  }
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
                <div style={{ marginTop: "207px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                    onClick={() => {
                      this.setState({ showPasswordLess: true })
                    }}
                    style={{ marginBottom: "8px" }}
                    buttonStyle={{ backgroundColor: "#0083ff" }}
                    disabled={
                      !(this.props.name && this.state.isEmailValid) ||
                      this.state.showLoading
                    }
                  >
                    Next
                  </Button>
                  {querystringify.parse(
                    "?" + window.location.href.split("?")[1]
                  ).from === "accounts" &&
                  JSON.parse(localStorage.getItem("accountList"))[0] ? (
                    <MuiThemeProvider
                      theme={createMuiTheme(
                        this.props.mobile
                          ? {
                              palette: {
                                primary: { main: "#fff" },
                              },
                            }
                          : {
                              palette: {
                                primary: { main: "#0083ff" },
                              },
                            }
                      )}
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
          ) : (
            <React.Fragment>
              <div
                className="rightSide notSelectable"
                style={{ overflowY: "hidden", padding: "0 32px" }}
              >
                <Typography
                  variant="h3"
                  gutterBottom
                  className="defaultCursor"
                  style={{
                    color: "#0083ff",
                    textAlign: "center",
                    marginTop: "32px",
                    marginBottom: "32px",
                  }}
                >
                  Sign up
                </Typography>
                <List style={{ marginLeft: "-32px", marginRight: "-32px" }}>
                  {window.PublicKeyCredential && (
                    <ListItem
                      button
                      style={{ paddingLeft: "24px" }}
                      onClick={() => {}}
                    >
                      <ListItemIcon>
                        <Fingerprint style={{ color: "black" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Let's go passwordless!"
                        secondary="Fingerprint, face or security key"
                      />
                    </ListItem>
                  )}
                  <ListItem
                    button
                    style={{ paddingLeft: "24px" }}
                    onClick={() => {
                      this.setState({
                        manualCodeOpen: true,
                        qrErrpr: false,
                        showSignupPassword: true,
                      })
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon>
                        <svg
                          style={{ width: "24px", height: "24px" }}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#000000"
                            d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20M8.5,12A1.5,1.5 0 0,0 7,10.5A1.5,1.5 0 0,0 5.5,12A1.5,1.5 0 0,0 7,13.5A1.5,1.5 0 0,0 8.5,12M13,10.89C12.39,10.33 11.44,10.38 10.88,11C10.32,11.6 10.37,12.55 11,13.11C11.55,13.63 12.43,13.63 13,13.11V10.89Z"
                          />
                        </svg>
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primary="Use a password"
                      secondary="The old-fashioned way"
                    />
                  </ListItem>
                  <ListItem
                    button
                    style={{ paddingLeft: "24px" }}
                    onClick={() => {
                      this.setState({ manualCodeOpen: true, qrErrpr: false })
                    }}
                  >
                    <ListItemIcon>
                      <Mail style={{ color: "black" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Send me an email"
                      secondary="Get a log in link via email"
                    />
                  </ListItem>
                </List>
                <MuiThemeProvider
                  theme={createMuiTheme(
                    this.props.mobile
                      ? {
                          palette: {
                            primary: { main: "#fff" },
                          },
                        }
                      : {
                          palette: {
                            primary: { main: "#0083ff" },
                          },
                        }
                  )}
                >
                  <Button
                    fullWidth={true}
                    color="primary"
                    disabled={this.state.showLoading}
                    onClick={() =>
                      this.setState({
                        showSignupPassword: false,
                        showPasswordLess: false,
                      })
                    }
                    style={
                      window.PublicKeyCredential
                        ? { marginTop: "237px" }
                        : { marginTop: "171px" }
                    }
                  >
                    Go back
                  </Button>
                </MuiThemeProvider>
              </div>
            </React.Fragment>
          )
        ) : (
          <React.Fragment>
            <div
              className="rightSide notSelectable"
              style={{ overflowY: "hidden", padding: "0 32px" }}
            >
              <div>
                <Typography
                  variant="h3"
                  gutterBottom
                  className="defaultCursor"
                  style={{
                    color: "#0083ff",
                    textAlign: "center",
                    marginTop: "32px",
                    marginBottom: "32px",
                  }}
                >
                  Sign up
                </Typography>
                <MuiThemeProvider theme={passwordTheme}>
                  <TextField
                    variant="outlined"
                    id="desktop-password-signup"
                    label="Password"
                    color="secondary"
                    style={{
                      color: "black",
                      width: "100%",
                      marginBottom: "16px",
                    }}
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.props.password}
                    error={this.state.isPasswordEmpty ? true : false}
                    helperText={
                      <font
                        style={
                          this.state.isPasswordEmpty
                            ? { color: "#f44336" }
                            : { color: passwordColor }
                        }
                      >
                        {this.props.password
                          ? this.state.isPasswordEmpty
                            ? "This field is required"
                            : scoreText
                          : " "}
                      </font>
                    }
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
                </MuiThemeProvider>
                <br />
                <TextField
                  variant="outlined"
                  id="desktop-confirm-password-signup"
                  label="Confirm password"
                  color="secondary"
                  style={{
                    color: "black",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.confirmPassword}
                  error={
                    this.state.isConfirmPasswordEmpty ||
                    this.state.passwordError
                      ? true
                      : false
                  }
                  helperText={
                    <font
                      style={
                        this.state.isConfirmPasswordEmpty ||
                        this.state.passwordError
                          ? { color: "#f44336" }
                          : {}
                      }
                    >
                      {this.state.isConfirmPasswordEmpty
                        ? "This field is required"
                        : this.state.passwordError || " "}
                    </font>
                  }
                  onChange={event => {
                    this.setState({
                      confirmPassword: event.target.value,
                      isConfirmPasswordEmpty: event.target.value === "",
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
                    this.state.confirmPassword ? (
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
              </div>
              <div style={{ marginTop: "207px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  primary={true}
                  onClick={() => {
                    if (this.state.password === this.state.confirmPassword) {
                      this.setState({ showLoading: true })
                      this.signUp()
                    } else {
                      this.setState({ passwordError: "Passwords don't match" })
                    }
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
                <MuiThemeProvider
                  theme={createMuiTheme(
                    this.props.mobile
                      ? {
                          palette: {
                            primary: { main: "#fff" },
                          },
                        }
                      : {
                          palette: {
                            primary: { main: "#0083ff" },
                          },
                        }
                  )}
                >
                  <Button
                    fullWidth={true}
                    color="primary"
                    disabled={this.state.showLoading}
                    onClick={() =>
                      this.setState({
                        showSignupPassword: false,
                        showPasswordLess: true,
                      })
                    }
                  >
                    Go back
                  </Button>
                </MuiThemeProvider>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}
