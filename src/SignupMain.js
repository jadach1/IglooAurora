import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Signup from "./components/unauthenticated/Signup"
import { hotkeys } from "react-keyboard-shortcuts"
import { Offline, Online } from "react-detect-offline"
import Typography from "@material-ui/core/Typography"
import polarBear from "./styles/assets/polarBear.svg"
import logo from "./styles/assets/logo.svg"
import iglooTitle from "./styles/assets/iglooTitle.svg"

class UnAuthenticatedApp extends Component {
  state = { slideIndex: 0 }

  hot_keys = {
    "alt+1": {
      priority: 1,
      handler: event => this.setState({ slideIndex: 0 }),
    },
    "alt+2": {
      priority: 1,
      handler: event => this.setState({ slideIndex: 1 }),
    },
  }

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
        <Online>
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
        </Online>
        <Offline key="offlineLogin">
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "#0057cb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                width: "400px",
              }}
            >
              <Typography variant="display1" style={{ color: "white" }}>
                You are not connected,
                <br />
                try again in a while
              </Typography>
              <br />
              <br />
              <br />
              <br />
              <img
                alt="Sleeping Polar Bear"
                src={polarBear}
                className="notSelectable"
              />
              <br />
              <br />
              <br />
              <br />
              <Typography
                variant="headline"
                gutterBottom
                style={{ color: "white" }}
              >
                In the meantime,
                <br />
                why don't you have a nap?
              </Typography>
            </div>
          </div>
        </Offline>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(UnAuthenticatedApp)
