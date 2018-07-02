import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Login from "./components/Login"
import Signup from "./components/Signup"
import SwipeableViews from "react-swipeable-views"
import BottomNavigation, {
  BottomNavigationAction,
} from "material-ui-next/BottomNavigation"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "material-ui-next/Icon"
import { Offline, Online } from "react-detect-offline"

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
          <div className="loginBackground">
            <Paper className="loginForm">
              <div className="leftSide notSelectable">
                <br />
                <br />
                <img
                  alt="Igloo Logo"
                  src="./assets/logo.svg"
                  width="300"
                  className="logo notSelectable"
                />
                <br />
                <br />

                <b>
                  <img
                    alt="Igloo"
                    src="./assets/iglooTitle.svg"
                    width="300"
                    className="unauthenticatedTitle notSelectable"
                  />
                </b>
              </div>
              <div>
                <BottomNavigation
                  onChange={this.handleChange}
                  value={this.state.slideIndex}
                  showLabels
                >
                  <BottomNavigationAction
                    label="SIGN UP"
                    icon={<Icon>person_add</Icon>}
                    style={
                      this.state.slideIndex
                        ? { color: "#757575" }
                        : { color: "#0083ff" }
                    }
                  />
                  <BottomNavigationAction
                    label="LOG IN"
                    icon={<Icon>person</Icon>}
                    style={
                      this.state.slideIndex
                        ? { color: "#0083ff" }
                        : { color: "#757575" }
                    }
                  />
                </BottomNavigation>
                <SwipeableViews
                  index={this.state.slideIndex}
                  onChangeIndex={this.handleChangeIndex}
                  enableMouseEvents
                  className="loginScreen"
                >
                  <Signup
                    client={this.client}
                    isDialog={false}
                    signIn={this.props.signIn}
                    goToLogin={() => this.setState({ slideIndex: 1 })}
                  />
                  <Login
                    client={this.client}
                    isDialog={false}
                    signIn={this.props.signIn}
                    goToSignup={() => this.setState({ slideIndex: 0 })}
                  />
                </SwipeableViews>
              </div>
            </Paper>
          </div>
        </Online>
        <Offline key="offlineLogin">
          <div className="loginBackground">
            <Paper className="offlineLoginPaper">
              <div className="offlineLoginForm">
                <div
                  className="offlineBodyLogin"
                  style={{ margin: "auto", width: 400, height: 450 }}
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
                    width="400"
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
