import React, { Component } from "react"
import Button from "material-ui-next/Button"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Input, { InputLabel, InputAdornment } from "material-ui-next/Input"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"
import Icon from "material-ui-next/Icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class Signup extends Component {
  constructor() {
    super()

    this.state = {
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
    }

    this.signUp = this.signUp.bind(this)
  }

  async signUp() {
    try {
      this.setState({ emailError: "", passwordError: "" })
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            SignupUser(email: $email, password: $password) {
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

      this.props.signIn(loginMutation.data.SignupUser.token)
    } catch (e) {
      if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.setState({
          emailError: "This email is already taken, maybe you want to sign in?",
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
      <div className="rightSide notSelectable">
        {this.props.isDialog ? "" : <h1 className="defaultCursor">Nice to meet you!</h1>}
        <MuiThemeProvider theme={theme}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel htmlFor="adornment-email">Email</InputLabel>
            <Input
              id="adornment-email-signup"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
              onKeyPress={event => {
                if (event.key === "Enter") this.signUp()
              }}
              endAdornment={
                this.state.email ? (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex="-1"
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
            <FormHelperText id="name-error-text-signup">
              {this.state.emailError}
            </FormHelperText>
          </FormControl>
          <br />
          <FormControl style={{ width: "100%" }}>
            <InputLabel htmlFor="adornment-password-signup">
              Password
            </InputLabel>
            <Input
              id="adornment-password-signup"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              onChange={event =>
                this.setState({
                  password: event.target.value,
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter") this.signUp()
              }}
              endAdornment={
                this.state.password ? (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex="-1"
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
            <FormHelperText id="password-error-text-signup">
              {this.state.passwordError}
            </FormHelperText>
          </FormControl>
          <br />
          <br />
          <br />
          <br />
          <Button
            variant="raised"
            color="primary"
            fullWidth={true}
            primary={true}
            onClick={this.signUp}
            buttonStyle={{ backgroundColor: "#0083ff" }}
          >
            Sign up
          </Button>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Signup
