import React, { Component } from "react"
import Button from "material-ui-next/Button"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Input, { InputAdornment } from "material-ui-next/Input"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"
import Icon from "material-ui-next/Icon"
import { Typography, Grid, CircularProgress } from "material-ui-next"
import zxcvbn from "zxcvbn"
import * as EmailValidator from "email-validator"

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
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      fullName: "",
      passwordScore: null,
      isEmailValid: null,
      isNameValid: true,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
    }

    this.signUp = this.signUp.bind(this)
  }

  async signUp() {
    try {
      this.setState({ emailError: "", passwordError: "" })
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!,$displayName: String!) {
            SignupUser(email: $email, password: $password,displayName:$displayName) {
              id
              token
            }
          }
        `,
        variables: {
          email: this.state.email,
          password: this.state.password,
          displayName: this.state.fullName
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem("email", this.state.email)
      }

      this.props.signIn(loginMutation.data.SignupUser.token)
    } catch (e) {
      this.setState({ showLoading: false })
      if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.setState({
          emailError: "This email is already taken",
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
    this.setState({ email: "", isMailEmpty: true })
  }

  render() {
    let scoreText = ""

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

    if (!this.state.password) scoreText = ""

    let customDictionary = [
      this.state.email,
      this.state.email.split("@")[0],
      this.state.fullName,
      "igloo",
      "igloo aurora",
      "aurora",
    ]

    return (
      <div
        className="rightSide notSelectable"
        style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}
      >
        <Typography
          variant="display1"
          gutterBottom
          className="defaultCursor"
          style={{ color: "white", textAlign: "center", fontSize: "2rem" }}
        >
          Nice to meet you!
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
                  value={this.state.fullName}
                  onChange={event =>
                    this.setState({
                      fullName: event.target.value,
                      isNameValid: event.target.value !== "",
                    })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.setState({ showLoading: true })
                      this.signUp()
                    }
                  }}
                  endAdornment={
                    this.state.fullName ? (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex="-1"
                          onClick={() =>
                            this.setState({ fullName: "", isNameValid: false })
                          }
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
                  value={this.state.email}
                  onChange={event =>
                    this.setState({
                      email: event.target.value,
                      isEmailValid: EmailValidator.validate(event.target.value),
                      emailError: "",
                      isMailEmpty: event.target.value === "",
                    })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.setState({ showLoading: true })
                      this.signUp()
                    }
                  }}
                  endAdornment={
                    this.state.email ? (
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
                  {this.state.emailError ||
                    (!this.state.isEmailValid && this.state.email
                      ? "Enter a valid email"
                      : "")}
                  {this.state.isMailEmpty ? "This field is required" : ""}
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
                  value={this.state.password}
                  onChange={event =>
                    this.setState({
                      password: event.target.value,
                      passwordScore: zxcvbn(
                        event.target.value,
                        customDictionary
                      ).score,
                      isPasswordEmpty: event.target.value === "",
                    })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") {
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
                  {scoreText}
                  {this.state.isPasswordEmpty ? "This field is required" : ""}
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
                this.state.fullName &&
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
        </MuiThemeProvider>
      </div>
    )
  }
}

export default SignupMobile
