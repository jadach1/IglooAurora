import React, { Component } from "react"
import gql from "graphql-tag"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import InputAdornment from "@material-ui/core/InputAdornment"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import ForgotPassword from "./ForgotPassword"
import * as EmailValidator from "email-validator"
import logo from "../../styles/assets/logo.svg"
import { Redirect } from "react-router-dom"
import CenteredSpinner from "../CenteredSpinner"

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
      changeServerOpen: false,
      tapCounter: 0,
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
    if (this.state.tapCounter === 7) {
      this.setState({ tapCounter: 0 })
      this.props.openChangeServer()
    }

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
                  }}
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.setState({ showLoading: true })
                      if (
                        EmailValidator.validate(this.props.email) &&
                        this.props.password
                      )
                        this.signIn()
                    }
                  }}
                  endAdornment={
                    this.props.email ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            this.props.changeEmail("")
                            this.setState({ isMailEmpty: true })
                          }}
                          tabIndex="-1"
                          style={{ color: "white" }}
                        >
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
                  }}
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.setState({ showLoading: true })
                      if (
                        EmailValidator.validate(this.props.email) &&
                        this.props.password
                      )
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
              <Checkbox
                onChange={event =>
                  this.setState({ keepLoggedIn: event.target.checked })
                }
                checked={this.state.keepLoggedIn}
                style={{ color: "white" }}
              />
            }
            label={
              <Typography
                variant="subtitle1"
                style={{
                  cursor: "pointer",
                  color: "white",
                  width: "134px",
                  marginRight: "0px",
                  marginLeft: "auto",
                }}
              >
                Keep me logged in
              </Typography>
            }
          />
          <br />
          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <Typography
              variant="subtitle1"
              style={{
                cursor: "pointer",
                color: "white",
                width: "130px",
                marginRight: "0px",
                marginLeft: "auto",
              }}
              onClick={() => {
                this.setState({ forgotPasswordOpen: true })
              }}
            >
              Forgot password?
            </Typography>
          </div>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              this.setState({ showLoading: true })
              this.signIn()
            }}
            color="primary"
            disabled={
              !(
                EmailValidator.validate(this.props.email) && this.props.password
              ) || this.state.showLoading
            }
          >
            Log in
            {this.state.showLoading && <CenteredSpinner isInButton secondary />}
          </Button>
          <Typography
            variant="subtitle1"
            style={
              this.state.showLoading
                ? {
                    marginTop: "16px",
                    marginBottom: "16px",
                    color: "white",
                    opacity: 0.5,
                    textAlign: "center",
                  }
                : {
                    marginTop: "16px",
                    marginBottom: "16px",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "center",
                  }
            }
            onClick={() =>
              !this.state.showLoading && this.setState({ redirect: true })
            }
          >
            No account yet? Sign up!
          </Typography>
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
