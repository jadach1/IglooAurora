import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "@material-ui/core/Paper"
import Login from "./components/unauthenticated/Login"
import Signup from "./components/unauthenticated/Signup"
import logo from "./styles/assets/logo.svg"
import iglooTitle from "./styles/assets/iglooTitle.svg"
import { Redirect } from "react-router-dom"
import Helmet from "react-helmet"
import ChangeServer from "./components/settings/ChangeServer"

export default class UnAuthenticatedMain extends Component {
  state = { redirect: false, tapCounter: 0, changeServerOpen: false }

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
  }

  render() {
    if (this.state.tapCounter === 7) {
      this.setState({ changeServerOpen: true, tapCounter: 0 })
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {this.props.isLogin
              ? "Igloo Aurora - Log in"
              : "Igloo Aurora - Sign up"}
          </title>
        </Helmet>
        <div className={this.props.unauthenticatedPicture}>
          <Paper className="loginForm" style={{ margin: "32px 0" }}>
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
                  onClick={() =>
                    this.setState(oldState => ({
                      tapCounter: oldState.tapCounter + 1,
                    }))
                  }
                />
                <img
                  src={iglooTitle}
                  alt="Igloo Aurora"
                  className="notSelectable"
                  style={{ width: "300px" }}
                />
              </div>
            </div>
            {this.props.isLogin ? (
              <Login
                client={this.client}
                isDialog={false}
                signIn={this.props.signIn}
                setEnvironments={this.props.setEnvironments}
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
        <ChangeServer
          open={this.state.changeServerOpen}
          close={() => this.setState({ changeServerOpen: false })}
                    forceUpdate={() => this.props.forceUpdate()}
          isUnauthenticated
        />
        {this.props.redirect && (
          <Redirect to={this.props.isLogin ? "/signup" : "/login"} />
        )}
      </React.Fragment>
    )
  }
}
