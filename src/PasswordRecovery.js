import React, { Component } from "react"
import PasswordRecoveryError from "./PasswordRecoveryError"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Fade from "@material-ui/core/Fade"
import zxcvbn from "zxcvbn"
import gql from "graphql-tag"
import logo from "./styles/assets/logo.svg"
import { Redirect } from "react-router-dom"
import CenteredSpinner from "./components/CenteredSpinner"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import VpnKey from "@material-ui/icons/VpnKey"

export default class PasswordRecovery extends Component {
  state = {
    showPassword: false,
    redirect: false,
    showLoading: false,
    passwordError: "",
  }

  async updatePassword() {
    this.setState({ showLoading: true })

    try {
      let changePassword = await this.props.client.mutate({
        mutation: gql`
          mutation($newPassword: String!) {
            changePassword(newPassword: $newPassword) {
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
          newPassword: this.props.password,
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem(
          "userId",
          changePassword.data.changePassword.user.id
        )

        localStorage.getItem("accountList")
          ? !JSON.parse(localStorage.getItem("accountList")).some(
              account =>
                account.id === changePassword.data.changePassword.user.id
            ) &&
            localStorage.setItem(
              "accountList",
              JSON.stringify([
                {
                  token: changePassword.data.changePassword.token,
                  ...changePassword.data.changePassword.user,
                },
                ...JSON.parse(localStorage.getItem("accountList")),
              ])
            )
          : localStorage.setItem(
              "accountList",
              JSON.stringify([
                {
                  token: changePassword.data.changePassword.token,
                  ...changePassword.data.changePassword.user,
                },
              ])
            )
      }

      this.props.userData.user.email !== "undefined" &&
        typeof Storage !== "undefined" &&
        this.props.userData.user &&
        localStorage.setItem("email", this.props.userData.user.email)
      this.forceUpdate()

      this.setState({ redirect: true })
    } catch (e) {
      this.setState({ passwordError: "Unexpected error" })
    }

    this.setState({ showLoading: false })
  }

  updateDimensions() {
    if (window.innerWidth < 400) {
      !this.state.isMobile && this.setState({ isMobile: true })
    } else {
      this.state.isMobile && this.setState({ isMobile: false })
    }
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    document.body.style.backgroundColor = "#0057cb"

    const {
      userData: { error, loading, user },
    } = this.props

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

    if (!this.props.password) scoreText = ""

    if (error) {
      if (
        error.message !==
        "Network error: Response not successful: Received status code 401"
      )
        return "Unexpected error"
      else {
        return <PasswordRecoveryError error="Your recovery link is expired" />
      }
    }

    if (loading) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0057cb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="notSelectable defaultCursor"
        >
          <Fade
            in={true}
            style={{
              transitionDelay: "800ms",
            }}
            unmountOnExit
          >
            <CircularProgress size={96} color="secondary" />
          </Fade>
        </div>
      )
    }

    if (this.props.isTokenValid) {
      return <PasswordRecoveryError error="Your recovery link isn't valid" />
    }

    if (this.state.redirect) {
      return <Redirect push to="/" />
    }

    return (
      <div
        style={{
          position: "absolute",
          margin: "auto",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          maxWidth: "332px",
          maxHeight: "381px",
          textAlign: "center",
          padding: "0 32px",
          backgroundColor: "#0057cb",
        }}
        className="notSelectable defaultCursor"
      >
        <img
          src={logo}
          alt="Igloo logo"
          className="notSelectable nonDraggable"
          draggable="false"
          style={{
            maxWidth: "192px",
            marginBottom: "72px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <Typography
          variant={this.state.isMobile ? "h5" : "h4"}
          style={{ color: "white", marginBottom: "32px" }}
        >
          Recover your account
        </Typography>
        <Grid
          container
          spacing={0}
          alignItems="flex-end"
          style={{ width: "100%", marginBottom: "12px" }}
        >
          <Grid item style={{ marginRight: "16px" }}>
            <VpnKey style={{ color: "white", marginBottom: "20px" }} />
          </Grid>
          <Grid item style={{ width: "calc(100% - 48px)" }}>
            <FormControl style={{ width: "100%" }}>
              <Input
                id="password"
                placeholder="New password"
                style={{
                  color: "white",
                }}
                value={this.props.password}
                type={this.state.showPassword ? "text" : "password"}
                onChange={event => {
                  this.setState({
                    passwordScore: zxcvbn(event.target.value, [
                      user.email,
                      user.email.split("@")[0],
                      user.name,
                      "igloo",
                      "igloo aurora",
                      "aurora",
                    ]).score,
                    isPasswordEmpty: event.target.value === "",
                  })
                  this.props.updatePassword(event.target.value)
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.updatePassword(this.props.password)
                  }
                }}
                endAdornment={
                  this.props.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState(oldState => ({
                            showPassword: !oldState.showPassword,
                          }))
                        }
                        tabIndex="-1"
                        style={{ color: "white" }}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
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
                {this.state.isPasswordEmpty
                  ? "This field is required"
                  : this.state.passwordError}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          style={{ marginRight: "4px" }}
          onClick={() => this.setState({ redirect: true })}
        >
          Never mind
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!user || !(this.state.passwordScore >= 2)}
          onClick={() => {
            this.updatePassword(this.props.password)
          }}
        >
          Change password
          {this.state.showLoading && <CenteredSpinner isInButton noDelay />}
        </Button>
      </div>
    )
  }
}
