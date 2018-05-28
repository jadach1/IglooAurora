import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import {
  createMuiTheme,
  MuiThemeProvider as MuiThemeProviderNext,
} from "material-ui-next/styles"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Button from "material-ui-next/Button"
import { hotkeys } from "react-keyboard-shortcuts"
import Dialog from "material-ui-next/Dialog"
import Slide from "material-ui-next/transitions/Slide"
import ForgotPassword from "./components/ForgotPassword"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

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
        <div
          className="loginBackground"
          style={{
            verticalAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#0057cb",
              textAlign: "center",
              verticalAlign: "center",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <br />
            <img
              alt="Igloo Logo"
              src="./assets/logo.svg"
              width="75%"
              className="logo notSelectable"
            />
            <br />
            <br />

            <b>
              <img
                alt="Igloo"
                src="./assets/iglooTitle.svg"
                width="75%"
                className="unauthenticatedTitle notSelectable"
              />
            </b>
            <br />
            <br />
            <MuiThemeProviderNext theme={theme}>
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#fff",
                  height: "60px",
                }}
              >
                <Button
                  color="primary"
                  primary={true}
                  buttonStyle={{ backgroundColor: "#0083ff" }}
                  onClick={() => this.setState({ signIn: true })}
                  style={{ marginTop: "12px" }}
                >
                  Sign up
                </Button>{" "}
                <Button
                  variant="raised"
                  color="primary"
                  primary={true}
                  buttonStyle={{ backgroundColor: "#0083ff" }}
                  onClick={() => this.setState({ logIn: true })}
                  style={{ marginTop: "12px" }}
                >
                  Log in
                </Button>
              </div>
            </MuiThemeProviderNext>
            <Dialog
              open={this.state.signIn}
              onClose={() => this.setState({ signIn: false })}
              TransitionComponent={Transition}
            >
              <div style={{ padding: "0 24px 24px 24px", width: "300px" }}>
                <Signup
                  client={this.client}
                  signIn={this.props.signIn}
                  goToLogin={() => this.setState({ slideIndex: 1 })}
                />
              </div>
            </Dialog>
            <Dialog
              open={this.state.logIn}
              onClose={() => this.setState({ logIn: false })}
              TransitionComponent={Transition}
            >
              <div style={{ padding: "0 24px 24px 24px", width: "300px" }}>
                <Login
                  client={this.client}
                  signIn={this.props.signIn}
                  goToSignup={() => this.setState({ slideIndex: 0 })}
                  isMobile={true}
                  closeMobileDialog={() => this.setState({ logIn: false })}
                  openForgotPassword={() =>
                    this.setState({ forgotPasswordOpen: true })
                  }
                />
              </div>
            </Dialog>
            <ForgotPassword
              open={this.state.forgotPasswordOpen}
              close={() => this.setState({ forgotPasswordOpen: false })}
            />
          </div>
          <br />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(UnAuthenticatedApp)