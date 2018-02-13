import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Login from "./components/Login"
import Signup from "./components/Signup"

class UnAuthenticatedApp extends Component {
  constructor() {
    super()

    const link = new HttpLink({
      uri: "https://iglooql.herokuapp.com/graphql",
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache(),
    })

    let ui = "signUp"
    if (typeof Storage !== "undefined" && localStorage.getItem("email")) {
      ui = "logIn"
    }
    this.state = {
      ui,
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="loginBackground">
          <Paper className="loginForm">
            <div className="leftSide notSelectable">
              <br />
              <br />
              <img
                alt="Igloo Logo"
                src="/assets/logo.svg"
                width="300"
                className="logo notSelectable"
              />
              <br />
              <br />

              <b>
                <img
                  alt="Igloo"
                  src="/assets/iglooTitle.svg"
                  width="300"
                  className="unauthenticatedTitle notSelectable"
                />
              </b>
            </div>
            {this.state.ui === "logIn" ? (
              <Login
                client={this.client}
                signIn={this.props.signIn}
                goToSignup={() => this.setState({ ui: "signUp" })}
              />
            ) : (
              <Signup
                client={this.client}
                signIn={this.props.signIn}
                goToLogin={() => this.setState({ ui: "logIn" })}
              />
            )}
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default UnAuthenticatedApp
