import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "@material-ui/core/Paper"
import Login from "./components/unauthenticated/Login"
import Signup from "./components/unauthenticated/Signup"
import AccountSwitcher from "./components/unauthenticated/AccountSwitcher"
import logo from "./styles/assets/logo.svg"
import iglooTitle from "./styles/assets/iglooTitle.svg"
import Helmet from "react-helmet"
import ChangeServer from "./components/settings/ChangeServer"

export default class UnAuthenticatedMain extends Component {
  state = {
    redirect: false,
    tapCounter: 0,
    changeServerOpen: false,
    showAccountSwitcher: true,
  }

  render() {
    if (this.state.tapCounter === 7) {
      this.setState({ changeServerOpen: true, tapCounter: 0 })
    }

    let link = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? (localStorage.getItem("serverUnsecure") === "true"
              ? "http://"
              : "https://") +
            localStorage.getItem("server") +
            "/graphql"
          : `https://bering.igloo.ooo/graphql`,
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache(),
    })

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {this.props.isLogin
              ? "Igloo Aurora - Log in"
              : this.props.isAccountSwitcher
              ? "Igloo Aurora - Accounts"
              : "Igloo Aurora - Sign up"}
          </title>
        </Helmet>
        {this.props.mobile ? (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "#0057cb",
              overflowX: "hidden",
            }}
          >
            <div>
              {this.props.isLogin ? (
                <Login
                  mobile
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
                  openChangeServer={() =>
                    this.setState({ changeServerOpen: true })
                  }
                />
              ) : this.props.isAccountSwitcher ? (
                <AccountSwitcher
                  mobile
                  signIn={this.props.signIn}
                  changeEmail={this.props.changeEmail}
                  forceUpdate={() => this.props.forceUpdate()}
                  openChangeServer={() =>
                    this.setState({ changeServerOpen: true })
                  }
                />
              ) : (
                <Signup
                  mobile
                  client={this.client}
                  signup={this.props.signup}
                  signIn={this.props.signIn}
                  email={this.props.email}
                  password={this.props.password}
                  name={this.props.name}
                  emailError={this.props.emailError}
                  changeEmail={this.props.changeEmail}
                  changePassword={this.props.changePassword}
                  changeName={this.props.changeName}
                  changeEmailError={this.props.changeEmailError}
                  changeLoginEmail={this.props.changeLoginEmail}
                  openChangeServer={() =>
                    this.setState({ changeServerOpen: true })
                  }
                />
              )}
            </div>
          </div>
        ) : (
          <div className="auroraLoginBackground">
            <Paper
              className="loginForm"
              style={{ margin: "32px 0", borderRadius: "8px" }}
            >
              <div
                className="leftSide notSelectable"
                style={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src={logo}
                    alt="Igloo logo"
                    className="notSelectable nonDraggable"
                    draggable="false"
                    style={{ width: "300px", marginBottom: "77px" }}
                    onClick={() =>
                      this.setState(oldState => ({
                        tapCounter: oldState.tapCounter + 1,
                      }))
                    }
                  />
                  <img
                    src={iglooTitle}
                    alt="Igloo Aurora"
                    className="notSelectable nonDraggable"
                    draggable="false"
                    style={{ width: "300px" }}
                  />
                </div>
              </div>
              {this.props.isLogin ? (
                <Login
                  client={this.client}
                  isDialog={false}
                  signIn={this.props.signIn}
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
              ) : this.props.isAccountSwitcher ? (
                <AccountSwitcher
                  signIn={this.props.signIn}
                  changeEmail={this.props.changeEmail}
                  forceUpdate={() => this.props.forceUpdate()}
                />
              ) : (
                <Signup
                  client={this.client}
                  isDialog={false}
                  signIn={this.props.signIn}
                  goToLogin={() => this.setState({ slideIndex: 1 })}
                  email={this.props.email}
                  password={this.props.password}
                  name={this.props.name}
                  emailError={this.props.emailError}
                  changeEmail={this.props.changeEmail}
                  changePassword={this.props.changePassword}
                  changeName={this.props.changeName}
                  changeEmailError={this.props.changeEmailError}
                  changeLoginEmail={this.props.changeLoginEmail}
                />
              )}
            </Paper>
          </div>
        )}
        <ChangeServer
          open={this.state.changeServerOpen}
          close={() => this.setState({ changeServerOpen: false })}
          forceUpdate={() => this.props.forceUpdate()}
          isUnauthenticated
          unauthenticated
        />
      </React.Fragment>
    )
  }
}
