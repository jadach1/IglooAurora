import React, { Component } from "react"
import gql from "graphql-tag"
import {
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  InputAdornment,
  Input,
  Icon,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core"
import ForgotPassword from "./ForgotPassword"
import * as EmailValidator from "email-validator"
import logo from "../../styles/assets/logo.svg"
import { Redirect } from "react-router-dom"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#fff" },
    secondary: { main: "#0083ff" },
  },
})

export default class LoginMobile extends Component {
  constructor() {
    super()
    this.state = {
      forgotPasswordOpen: false,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
      height: 0,
      keepLoggedIn:
        typeof Storage !== "undefined"
          ? localStorage.getItem("keepLoggedIn") === "true"
          : true,
      redirect: false,
    }

    this.signIn = this.signIn.bind(this)
    this.recover = this.recover.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight })
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
      } else {
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
    this.props.changePassword("")
    this.setState({ isMailEmpty: true })
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="rightSide notSelectable"
          style={{
            maxWidth: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
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
                <Icon style={{ color: "white", marginBottom: "20px" }}>
                  email
                </Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-login"
                    placeholder="Email"
                    style={{ color: "white" }}
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
                        this.setState({ showLoading: true })
                        this.signIn()
                      }
                    }}
                    endAdornment={
                      this.props.email ? (
                        <InputAdornment position="end">
                          <IconButton tabIndex="-1" style={{ color: "white" }}>
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="name-error-text-login"
                    style={{ color: "white" }}
                  >
                    {this.state.isMailEmpty
                      ? "This field is required"
                      : this.state.emailError}
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
                    id="adornment-password-login"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.props.password}
                    placeholder="Password"
                    style={{ color: "white" }}
                    onChange={event => {
                      this.props.changePassword(event.target.value)
                      this.props.changePasswordError("")
                      this.setState({
                        isPasswordEmpty: event.target.value === "",
                      })
                    }
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        this.setState({ showLoading: true })
                        this.signIn()
                      }
                    }}
                    endAdornment={
                      this.props.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                            style={{ color: "white" }}
                          >
                            {this.state.showPassword ? (
                              <Icon style={{ color: "white" }}>
                                visibility_off
                              </Icon>
                            ) : (
                                <Icon style={{ color: "white" }}>visibility</Icon>
                              )}
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="passowrd-error-text-login"
                    style={{ color: "white" }}
                  >
                    {this.props.passwordError}
                    {this.state.isPasswordEmpty ? "This field is required" : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <FormControlLabel
              style={{ marginLeft: "-12px" }}
              control={
                <MuiThemeProvider
                  theme={createMuiTheme({
                    palette: {
                      primary: { main: "#fff" },
                      secondary: { main: "#fff" },
                      default: { main: "#fff" },
                    },
                  })}
                >
                  <Checkbox
                    onChange={event =>
                      this.setState({ keepLoggedIn: event.target.checked })
                    }
                    checked={this.state.keepLoggedIn}
                    style={{ color: "white" }}
                  />
                </MuiThemeProvider>
              }
              label={
                <Typography
                  variant="subheading"
                  style={{ paddingLeft: "4px", color: "white" }}
                >
                  Keep me logged in
                </Typography>
              }
            />
            <br />
            <div style={{ textAlign: "right", marginBottom: "16px" }}>
              <Typography
                variant="subheading"
                style={{
                  cursor: "pointer",
                  color: "white",
                }}
                onClick={() => {
                  this.setState({ forgotPasswordOpen: true })
                }}
              >
                Forgot password?
              </Typography>
            </div>
            <Button
              variant="raised"
              primary={true}
              fullWidth={true}
              onClick={() => {
                this.setState({ showLoading: true })
                this.signIn()
              }}
              color="secondary"
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
              No account yet? Sign up!
            </Typography>
          </MuiThemeProvider>
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
