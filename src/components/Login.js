import React, { Component } from "react"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import gql from "graphql-tag"

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
        this.setState({ passwordError: "Incorrect password" })
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

  render() {
    return (
      <div className="rightSide">
        <h1>Welcome back!</h1>
        <TextField
          hintText="Email"
          floatingLabelText="Email"
          errorText={this.state.emailError}
          value={this.state.email}
          onChange={event => this.setState({ email: event.target.value })}
          onKeyPress={event => {
            if (event.key === "Enter") this.signIn()
          }}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
        />
        <br />
        <TextField
          hintText="Password"
          floatingLabelText="Password"
          errorText={this.state.passwordError}
          type="password"
          value={this.state.password}
          onChange={event =>
            this.setState({
              password: event.target.value,
            })
          }
          onKeyPress={event => {
            if (event.key === "Enter") this.signIn()
          }}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
        />
        <br />
        <br />
        <br />
        <RaisedButton
          label="Log in"
          primary={true}
          fullWidth={true}
          onClick={this.signIn}
          buttonStyle={{ backgroundColor: "#0083ff" }}
        />
        <br />
        <br />
        No account?<br />
        <span style={{ color: "#0083ff" }} onClick={this.props.goToSignup}>
          Create one!
        </span>
      </div>
    )
  }
}

export default Login
