import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SignupMobile from "./components/unauthenticated/SignupMobile"
import Helmet from "react-helmet"

class UnAuthenticatedApp extends Component {
  state = { logiIn: false, signIn: false }

  constructor() {
    super()

    const link = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? localStorage.getItem("server") + "/graphql"
          : `http://iglooql.herokuapp.com/graphql`,
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache(),
    })

    let slideIndex = 0
    if (typeof Storage !== "undefined" && localStorage.getItem("email")) {
      slideIndex = 1
    }
    this.state = {
      slideIndex,
    }
  }

  handleChange = (event, value) => {
    this.setState({ slideIndex: value })
  }

  handleChangeIndex = index => {
    this.setState({ slideIndex: index })
  }

  render() {
    return (
      <MuiThemeProvider>
        <Helmet>
          <title>Igloo Aurora - Sign up</title>
        </Helmet>
        <div
          style={
            window.innerHeight >= 690
              ? {
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "#0057cb",
                }
              : {
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "#0057cb",
                }
          }
        >
          <div style={{ marginRight: "32px", marginLeft: "32px" }}>
            <SignupMobile
              client={this.client}
              signup={this.props.signup}
              signIn={this.props.signIn}
              email={this.props.email}
              password={this.props.password}
              fullName={this.props.fullName}
              emailError={this.props.emailError}
              changeEmail={this.props.changeEmail}
              changePassword={this.props.changePassword}
              changeFullName={this.props.changeFullName}
              changeEmailError={this.props.changeEmailError}
              changeLoginEmail={this.props.changeLoginEmail}
            />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default UnAuthenticatedApp
