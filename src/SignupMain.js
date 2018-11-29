import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "@material-ui/core/Paper"
import Signup from "./components/unauthenticated/Signup"
import logo from "./styles/assets/logo.svg"
import iglooTitle from "./styles/assets/iglooTitle.svg"
import Helmet from "react-helmet"

class UnAuthenticatedApp extends Component {
  state = { slideIndex: 0 }

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
          <title>Igloo Aurora - Sign up</title>
        </Helmet>
        <div className="loginBackground">
          <Paper className="loginForm">
            <div
              className="leftSide notSelectable"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src={logo}
                  alt="Igloo logo"
                  className="notSelectable"
                  style={{ width: "300px", marginBottom: "77px" }}
                />
                <img
                  src={iglooTitle}
                  alt="Igloo Aurora"
                  className="notSelectable"
                  style={{ width: "300px" }}
                />
              </div>
            </div>
            <Signup
              client={this.client}
              isDialog={false}
              signIn={this.props.signIn}
              goToLogin={() => this.setState({ slideIndex: 1 })}
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
          </Paper>
        </div>
      </React.Fragment>
    )
  }
}

export default UnAuthenticatedApp
