import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import gql from "graphql-tag"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"
import logo from "../../styles/assets/logo.svg"
import { Redirect } from "react-router-dom"
import ToggleIcon from "material-ui-toggle-icon"
import CenteredSpinner from "../CenteredSpinner"
import { Link } from "react-router-dom"
import Email from "@material-ui/icons/Email"
import Clear from "@material-ui/icons/Clear"
import VpnKey from "@material-ui/icons/VpnKey"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import AccountCircle from "@material-ui/icons/AccountCircle"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import queryString from "query-string"

class SignupMobile extends Component {
  constructor() {
    super()

    this.state = {
      passwordScore: null,
      isEmailValid: null,
      isNameValid: true,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
      tapCounter: 0,
    }

    this.signUp = this.signUp.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
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

  render() {
    let scoreText = ""

    let customDictionary = [
      this.props.email,
      this.props.email.split("@")[0],
      this.props.name,
      "igloo",
      "igloo aurora",
      "aurora",
    ]

    switch (this.state.passwordScore) {
      case 0:
        scoreText = "Very weak"
        break

      case 1:
        scoreText = "Weak"
        break

      case 2:
        scoreText = "Average"
        break

      case 3:
        scoreText = "Strong"
        break

      case 4:
        scoreText = "Very strong"
        break

      default:
        scoreText = ""
        break
    }

    if (!this.props.password) scoreText = ""

    if (this.state.tapCounter === 7) {
      this.setState({ tapCounter: 0 })
      this.props.openChangeServer()
    }

    return (
      <div
        className="rightSide notSelectable"
        style={{ maxWidth: "448px", marginLeft: "auto", marginRight: "auto" }}
      >
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
        <Typography
          variant="h3"
          gutterBottom
          className="defaultCursor"
          style={{ color: "white", textAlign: "center" }}
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
            <AccountCircle style={{ color: "white", marginBottom: "20px" }} />
          </Grid>
          <Grid item style={{ width: "calc(100% - 40px)" }}>
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-email-signup"
                placeholder="Full name"
                style={{ color: "white" }}
                value={this.props.name}
                onChange={event => {
                  this.props.changeName(event.target.value)
                  this.setState({
                    isNameValid: event.target.value !== "",
                  })
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.setState({ showLoading: true })
                    this.signUp()
                  }
                }}
                endAdornment={
                  this.props.name ? (
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex="-1"
                        onClick={() => {
                          this.props.changeName("")
                          this.setState({ isNameValid: false })
                        }}
                        style={{ color: "white" }}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText
                id="name-error-text-signup"
                style={{ color: "white" }}
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
            <Email style={{ color: "white", marginBottom: "20px" }} />
          </Grid>
          <Grid item style={{ width: "calc(100% - 40px)" }}>
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-email-signup"
                placeholder="Email"
                style={{ color: "white" }}
                value={this.props.email}
                onChange={event => {
                  this.props.changeEmail(event.target.value)
                  this.props.changeEmailError("")
                  this.setState({
                    isEmailValid: EmailValidator.validate(event.target.value),
                    isMailEmpty: event.target.value === "",
                  })
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") {
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
                        style={{ color: "white" }}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText
                id="name-error-text-signup"
                style={{ color: "white" }}
              >
                {this.state.isMailEmpty
                  ? "This field is required"
                  : this.props.emailError ||
                    (!this.state.isEmailValid && this.props.email
                      ? "Enter a valid email"
                      : "")}
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
            <VpnKey style={{ color: "white", marginBottom: "20px" }} />
          </Grid>
          <Grid item style={{ width: "calc(100% - 40px)" }}>
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-signup"
                placeholder="Password"
                style={{ color: "white" }}
                type={this.state.showPassword ? "text" : "password"}
                value={this.props.password}
                onChange={event => {
                  this.props.changePassword(event.target.value)
                  this.setState({
                    passwordScore: zxcvbn(event.target.value, customDictionary)
                      .score,
                    isPasswordEmpty: event.target.value === "",
                  })
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") {
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
                        style={{ color: "white" }}
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
                style={{ color: "white" }}
              >
                {this.state.isPasswordEmpty
                  ? "This field is required"
                  : scoreText}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={() => {
            this.setState({ showLoading: true })
            this.signUp()
          }}
          disabled={
            !(
              this.props.name &&
              this.state.isEmailValid &&
              this.state.passwordScore >= 2
            ) || this.state.showLoading
          }
        >
          Sign up
          {this.state.showLoading && <CenteredSpinner isInButton secondary />}
        </Button>
        {queryString.parse("?" + window.location.href.split("?")[1]).from ===
          "accounts" && JSON.parse(localStorage.getItem("accountList"))[0] ? (
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#fff" },
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
                primary: { main: "#fff" },
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
        {this.state.redirect && <Redirect push to="/login" />}
      </div>
    )
  }
}

export default SignupMobile
