import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import LoginMobile from "./components/LoginMobile"
import SignupMobile from "./components/SignupMobile"
import { hotkeys } from "react-keyboard-shortcuts"
import { Offline, Online } from "react-detect-offline"
import BottomNavigation, {
  BottomNavigationAction,
} from "material-ui-next/BottomNavigation"
import Icon from "material-ui-next/Icon"
import AppBar from "material-ui-next/AppBar"
import SwipeableViews from "react-swipeable-views"
import { Typography } from "material-ui-next"
import polarBear from "./styles/assets/polarBear.svg"
import logo from "./styles/assets/logo.svg"

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
      uri: "https://iglooql.herokuapp.com/graphql",
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
                    height: "calc( 100vh - 164px)",
                    backgroundColor: "#0057cb",
                    paddingTop: "100px",
                  }
                : {
                    width: "100vw",
                    height: "calc( 100vh - 114px)",
                    backgroundColor: "#0057cb",
                    paddingTop: "50px",
                  }
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={logo}
                alt="Igloo logo"
                className="notSelectable"
                style={
                  window.innerHeight >= 690
                    ? {
                        width: "150px",
                        marginBottom: "100px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }
                    : {
                        width: "150px",
                        marginBottom: "50px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }
                }
              />
            </div>
            <SwipeableViews
              index={this.state.slideIndex}
              onChangeIndex={this.handleChangeIndex}
              style={
                window.innerHeight >= 690
                  ? { height: "calc(100vh - 352px)" }
                  : { height: "calc(100vh - 252px)" }
              }
            >
              <div style={{ marginRight: "32px", marginLeft: "32px" }}>
                <SignupMobile
                  client={this.client}
                  signIn={this.props.signIn}
                  goToLogin={() => this.setState({ slideIndex: 1 })}
                />
              </div>
              <div style={{ marginRight: "32px", marginLeft: "32px" }}>
                <LoginMobile
                  client={this.client}
                  signIn={this.props.signIn}
                  goToSignup={() => this.setState({ slideIndex: 0 })}
                />
              </div>
            </SwipeableViews>
          </div>
          <AppBar
            color="default"
            position="static"
            style={{ marginBottom: "0px", marginTop: "auto", height: "64px" }}
          >
            <BottomNavigation
              onChange={this.handleChange}
              value={this.state.slideIndex}
              showLabels
              style={{ width: "100vw", height: "64px" }}
            >
              <BottomNavigationAction
                label="SIGN UP"
                icon={<Icon>person_add</Icon>}
                style={
                  this.state.slideIndex === 0
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
              <BottomNavigationAction
                label="LOG IN"
                icon={<Icon>person</Icon>}
                style={
                  this.state.slideIndex === 1
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
            </BottomNavigation>
          </AppBar>
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
