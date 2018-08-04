import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import {
  createMuiTheme,
  MuiThemeProvider as MuiThemeProviderNext,
} from "material-ui-next/styles"
import LoginMobile from "./components/LoginMobile"
import SignupMobile from "./components/SignupMobile"
import Button from "material-ui-next/Button"
import { hotkeys } from "react-keyboard-shortcuts"
import Dialog from "material-ui/Dialog"
import ForgotPassword from "./components/ForgotPassword"
import { Offline, Online } from "react-detect-offline"
import Paper from "material-ui/Paper"
import BottomNavigation, {
  BottomNavigationAction,
} from "material-ui-next/BottomNavigation"
import Icon from "material-ui-next/Icon"
import AppBar from "material-ui-next/AppBar"
import SwipeableViews from "react-swipeable-views"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class UnAuthenticatedApp extends Component {
  state = { logiIn: false, signIn: false }

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
            style={{
              width: "100vw",
              height: "calc( 100vh - 164px)",
              backgroundColor: "#0057cb",
              paddingTop: "100px",
            }}
          >
            <div
              className="logo notSelectable"
              style={{
                width: "150px",
                height: "59px",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "100px",
              }}
            /> <SwipeableViews
                  index={this.state.slideIndex}
                  onChangeIndex={this.handleChangeIndex}
                  style={{height:"calc(100vh - 323px)"}}
                >
                <div style={{marginRight:"32px",marginLeft:"32px"}}>
                  <SignupMobile
                    client={this.client}
                    signIn={this.props.signIn}
                    goToLogin={() => this.setState({ slideIndex: 1 })}
                  />
                  </div>
                  <div style={{marginRight:"32px",marginLeft:"32px"}}>
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
                style={   this.state.slideIndex === 0
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
              <BottomNavigationAction
                label="LOG IN"
                icon={<Icon>person</Icon>}
                style={   this.state.slideIndex === 1
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
            </BottomNavigation>
                            </AppBar>
        </Online>
        <Offline>
          <div className="loginBackground">
            <Paper className="offlineLoginMobilePaper">
              <div className="offlineLoginForm">
                <div
                  className="offlineBodyLogin"
                  style={{ margin: "auto", width: 350, height: 450 }}
                >
                  <font size="6">
                    You are not connected, try again in a while
                  </font>
                  <br />
                  <br />
                  <font size="5">
                    In the meantime, why don't you have a nap?
                  </font>
                  <br />
                  <img
                    alt="Sleeping Polar Bear"
                    src="./assets/polarBear.svg"
                    width="300"
                    className="notSelectable"
                  />
                </div>
              </div>
            </Paper>
          </div>
        </Offline>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(UnAuthenticatedApp)
