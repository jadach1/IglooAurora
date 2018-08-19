import React, { Component } from "react"
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  IconButton,
  Button,
  Icon,
  Grid,
  createMuiTheme,
  MuiThemeProvider,
  Typography,
} from "material-ui-next"
import { Link } from "react-router-dom"
import zxcvbn from "zxcvbn"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import logo from "./styles/assets/logo.svg"
import { Redirect } from "react-router-dom"

class PasswordRecovery extends Component {
  state = { password: "", showPassword: false, redirect: false }

  render() {
    let scoreText = ""

    let changePassword = newPassword => {
      this.props["ChangePassword"]({
        variables: {
          newPassword,
        },
      })
    }

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
      /*       this.state.email,
      this.state.email.split("@")[0],
      this.state.fullName, */
      "igloo",
      "igloo aurora",
      "aurora",
    ]

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
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            width: "327px",
          }}
        >
          <img
            src={logo}
            alt="Igloo logo"
            className="notSelectable"
            style={
              window.innerHeight >= 690
                ? {
                    width: "200px",
                    marginBottom: "100px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
                : {
                    width: "200px",
                    marginBottom: "50px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
            }
          />
          <Typography variant="display1" style={{ color: "white" }}>
            Recover your account
          </Typography>
          <br />
          <br />
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#fff" },
                secondary: { main: "#0083ff" },
              },
            })}
          >
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
                    id="password"
                    placeholder="New password"
                    style={{
                      color: "white",
                    }}
                    value={this.state.password}
                    type={this.state.showPassword ? "text" : "password"}
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
                        changePassword(this.state.password)
                        this.setState({ redirect: true })
                      }
                    }}
                    endAdornment={
                      this.state.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              this.setState(oldState => ({
                                showPassword: !oldState.showPassword,
                              }))
                            }
                            onMouseDown={event => event.preventDefault()}
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
            <Link
              to="/login/"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Button color="primary" style={{ marginRight: "4px" }}>
                Never mind
              </Button>
            </Link>
            <Link
              to="/login/"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Button
                variant="raised"
                color="secondary"
                disabled={!(this.state.passwordScore >= 2)}
                onClick={() => changePassword(this.state.password)}
              >
                Change password
              </Button>
            </Link>
          </MuiThemeProvider>
        </div>
        {this.state.redirect && <Redirect push to="/dashboard/" /> }
      </div>
    )
  }
}

export default graphql(
  gql`
    mutation ChangePassword($newPassword: String!) {
      ChangePassword(newPassword: $newPassword) {
        id
      }
    }
  `,
  {
    name: "ChangePassword",
  }
)(PasswordRecovery)
