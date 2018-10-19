import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SignupMobile from "./components/unauthenticated/SignupMobile"
import { hotkeys } from "react-keyboard-shortcuts"
import { Offline, Online } from "react-detect-offline"
import { Typography } from "material-ui-next"
import polarBear from "./styles/assets/polarBear.svg"

class UnAuthenticatedApp extends Component {
  state = { logiIn: false, signIn: false }

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
      typeof Storage !== "undefined" && localStorage.getItem("server")!==""
    ? localStorage.getItem("server") + "graphql"
    : `http://iglooql.herokuapp.com/graphql`
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
              <SignupMobile client={this.client} signup={this.props.signup} signIn={this.props.signIn}
                email={this.props.email}
                password={this.props.password}
                fullName={this.props.fullName}
                emailError={this.props.emailError}
                changeEmail={this.props.changeEmail}
                changePassword={this.props.changePassword}
                changeFullName={this.props.changeFullName}
                changeEmailError={this.props.changeEmailError}                 changeLoginEmail={this.props.changeLoginEmail}
                />
            </div>
          </div>
        </Online>
        <Offline>
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
                width: "80vw",
              }}
            >
              <Typography variant="headline" style={{ color: "white" }}>
                You are not connected, try again in a while
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
                variant="title"
                gutterBottom
                style={{ color: "white" }}
              >
                In the meantime, why don't you have a nap?
              </Typography>
            </div>
          </div>
        </Offline>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(UnAuthenticatedApp)
