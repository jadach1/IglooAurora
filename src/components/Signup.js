import React, { Component } from "react"
import Button from "material-ui-next/Button"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Input, { InputLabel, InputAdornment } from "material-ui-next/Input"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class Login extends Component {
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
        <h1>Nice to meet you!</h1>
        <MuiThemeProvider theme={theme}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel htmlFor="adornment-email">Email</InputLabel>
            <Input
              id="adornment-email"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
              onKeyPress={event => {
                if (event.key === "Enter") this.signUp()
              }}
              endAdornment={
                this.state.email ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickCancelEmail}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      <i class="material-icons">clear</i>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
            <FormHelperText id="name-error-text">
              {this.state.emailError}
            </FormHelperText>
          </FormControl>
          <br />
          <FormControl style={{ width: "100%" }}>
            <InputLabel htmlFor="adornment-password">Password</InputLabel>
            <Input
              id="adornment-password"
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
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
                        <i class="material-icons">visibility_off</i>
                      ) : (
                        <i class="material-icons">visibility</i>
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
            <FormHelperText id="name-error-text">
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

export default Login
