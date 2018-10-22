import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import gql from "graphql-tag"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import CircularProgress from "@material-ui/core/CircularProgress"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"
import logo from "../../styles/assets/logo.svg"
import { Redirect } from "react-router-dom"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#fff" },
    secondary: { main: "#0083ff" },
  },
})

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
        this.props.fullName,
        "igloo",
        "igloo aurora",
        "aurora",
      ]).score,
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

  render() {
    let scoreText = ""

    let customDictionary = [
      this.props.email,
      this.props.email.split("@")[0],
      this.props.fullName,
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

    return (
      <div
        className="rightSide notSelectable"
        style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}
      >
        <img
          src={logo}
          alt="Igloo logo"
          className="notSelectable"
          style={
            this.state.height >= 690
              ? {
                  width: "200px",
                  paddingTop: "75px",
                  marginBottom: "75px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }
              : {
                  width: "150px",
                  paddingTop: "50px",
                  marginBottom: "50px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }
          }
        />
        <Typography
          variant="display2"
          gutterBottom
          className="defaultCursor"
          style={{ color: "white", textAlign: "center" }}
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
              <Icon style={{ color: "white", marginBottom: "20px" }}>
                account_circle
              </Icon>
            </Grid>
            <Grid item style={{ width: "calc(100% - 40px)" }}>
              <FormControl style={{ width: "100%" }}>
                <Input
                  id="adornment-email-signup"
                  placeholder="Full name"
                  style={{ color: "white" }}
                  value={this.props.fullName}
                  onChange={event => {
                    this.props.changeFullName(event.target.value)
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
                    this.props.fullName ? (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex="-1"
                          onClick={() => {
                            this.props.changeFullName("")
                            this.setState({ isNameValid: false })
                          }}
                          onMouseDown={this.handleMouseDownPassword}
                          style={{ color: "white" }}
                        >
                          <Icon>clear</Icon>
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
              <Icon style={{ color: "white", marginBottom: "20px" }}>
                email
              </Icon>
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
                          onMouseDown={this.handleMouseDownPassword}
                          style={{ color: "white" }}
                        >
                          <Icon>clear</Icon>
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
              <Icon style={{ color: "white", marginBottom: "20px" }}>
                vpn_key
              </Icon>
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
                      passwordScore: zxcvbn(
                        event.target.value,
                        customDictionary
                      ).score,
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
                          onMouseDown={this.handleMouseDownPassword}
                          style={{ color: "white" }}
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
            variant="raised"
            color="secondary"
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
                    primary: { main: "#fff" },
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
          <Typography
            variant="subheading"
            style={{
              marginTop: "16px",
              marginBottom: "16px",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => this.setState({ redirect: true })}
          >
            Already have an account? Log in
          </Typography>
          {this.state.redirect && <Redirect push to="/login" />}
        </MuiThemeProvider>
      </div>
    )
  }
}

export default SignupMobile
