import React, { Component } from "react"
import Button from "material-ui-next/Button"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Input, { InputLabel, InputAdornment } from "material-ui-next/Input"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"
import Icon from "material-ui-next/Icon"
import ForgotPassword from "./ForgotPassword"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class Login extends Component {
  constructor() {
    super()
    let email = ""

    if (typeof Storage !== "undefined") {
      email = localStorage.getItem("email") || ""
    }

    this.state = {
      email,
      emailError: "",
      password: "",
      passwordError: "",
      forgotPasswordOpen: false,
    }

    this.signIn = this.signIn.bind(this)
  }

  async signIn() {
    try {
      this.setState({ emailError: "", passwordError: "" })
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
          email: this.state.email,
          password: this.state.password,
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem("email", this.state.email)
      }

      this.props.signIn(loginMutation.data.AuthenticateUser.token)
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
      ) {
        this.setState({
          emailError: "This account does not exist, maybe you want to sign up?",
        })
      } else {
        console.log(e)
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
    this.setState({ email: "" })
  }

  render() {
    return (
      <React.Fragment>
        <div className="rightSide notSelectable">
          <h1>Welcome back!</h1>
          <MuiThemeProvider theme={theme}>
            <FormControl style={{ width: "100%" }}>
              <InputLabel htmlFor="adornment-email">Email</InputLabel>
              <Input
                id="adornment-email-login"
                value={this.state.email}
                onChange={event => this.setState({ email: event.target.value })}
                onKeyPress={event => {
                  if (event.key === "Enter") this.signIn()
                }}
                endAdornment={
                  this.state.email ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickCancelEmail}
                        onMouseDown={this.handleMouseDownPassword}
                        style={{ width: "32px", height: "32px" }}
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText id="name-error-text-login">
                {this.state.emailError}
              </FormHelperText>
            </FormControl>
            <br />
            <FormControl style={{ width: "100%" }}>
              <InputLabel htmlFor="adornment-password-login">
                Password
              </InputLabel>
              <Input
                id="adornment-password-login"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                onChange={event =>
                  this.setState({
                    password: event.target.value,
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.signIn()
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                        style={{ width: "32px", height: "32px" }}
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
              <FormHelperText id="passowrd-error-text-login">
                {this.state.passwordError}
              </FormHelperText>
            </FormControl>

            <br />
            <br />
            <div style={{ textAlign: "right" }}>
              <font
                className="loginForgotPassoword"
                onClick={() => {
                  if (this.props.isMobile) {
                    this.props.openForgotPassword()
                    this.props.closeMobileDialog()
                  }
                  this.setState({ forgotPasswordOpen: true })
                }}
              >
                Forgot password?
              </font>
            </div>
            <br />
            <Button
              variant="raised"
              primary={true}
              fullWidth={true}
              onClick={this.signIn}
              color="primary"
            >
              Log in
            </Button>
          </MuiThemeProvider>
        </div>
        <ForgotPassword
          open={this.state.forgotPasswordOpen}
          close={() => this.setState({ forgotPasswordOpen: false })}
        />
      </React.Fragment>
    )
  }
}

export default Login
