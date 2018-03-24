import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Tabs, { Tab } from "material-ui/Tabs"
import SwipeableViews from "react-swipeable-views"
import BottomNavigation, {
  BottomNavigationAction,
} from "material-ui-next/BottomNavigation"

class UnAuthenticatedApp extends Component {
  state = { slideIndex: 0 }

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
            <div>
              <BottomNavigation
                onChange={this.handleChange}
                value={this.state.slideIndex}
                showLabels
              >
                <BottomNavigationAction
                  label="Sign up"
                  icon={<i class="material-icons">person_add</i>}
                />
                <BottomNavigationAction
                  label="Log in"
                  icon={<i class="material-icons">person</i>}
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
                  signIn={this.props.signIn}
                  goToLogin={() => this.setState({ slideIndex: 1 })}
                />
                <Login
                  client={this.client}
                  signIn={this.props.signIn}
                  goToSignup={() => this.setState({ slideIndex: 0 })}
                />
              </SwipeableViews>
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default UnAuthenticatedApp
