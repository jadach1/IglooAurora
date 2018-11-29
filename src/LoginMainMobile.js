import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import LoginMobile from "./components/unauthenticated/LoginMobile"
import Helmet from "react-helmet"

class UnAuthenticatedApp extends Component {
  state = { logiIn: false, signIn: false }

  constructor() {
    super()

    const link = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? localStorage.getItem("server") + "/graphql"
          : `http://igloo-production.herokuapp.com/graphql`,
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
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora - Log in</title>
        </Helmet>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0057cb",
            overflowX: "hidden",
          }}
        >
          <div style={{ marginRight: "32px", marginLeft: "32px" }}>
            <LoginMobile
              client={this.client}
              signIn={this.props.signIn}
              goToSignup={() => this.setState({ slideIndex: 0 })}
              password={this.props.password}
              changePassword={this.props.changePassword}
              passwordError={this.props.passwordError}
              changePasswordError={this.props.changePasswordError}
              email={this.props.email}
              changeEmail={this.props.changeEmail}
              emailError={this.props.emailError}
              changeEmailError={this.props.changeEmailError}
              changeSignupEmail={this.props.changeSignupEmail}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default UnAuthenticatedApp
