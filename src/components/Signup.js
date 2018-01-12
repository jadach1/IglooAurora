import React, { Component } from "react"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import gql from "graphql-tag"

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

  render() {
    return (
      <div className="rightSide notSelectable">
        <h1>Nice to meet you!</h1>
        <TextField
          hintText="Email"
          floatingLabelText="Email"
          errorText={this.state.emailError}
          value={this.state.email}
          onChange={event => this.setState({ email: event.target.value })}
          onKeyPress={event => {
            if (event.key === "Enter") this.signUp()
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
            if (event.key === "Enter") this.signUp()
          }}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
        />
        <br />
        <br />
        <br />
        <RaisedButton
          label="Sign up"
          fullWidth={true}
          primary={true}
          onClick={this.signUp}
          buttonStyle={{ backgroundColor: "#0083ff" }}
        />
        <br />
        <br />
        Already have an account?<br />
        <span style={{ color: "#0083ff" }} onClick={this.props.goToLogin}>
          Log in here
        </span>
      </div>
    )
  }
}

export default Login
