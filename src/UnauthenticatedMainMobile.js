import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import LoginMobile from "./components/unauthenticated/LoginMobile"
import SignupMobile from "./components/unauthenticated/SignupMobile"
import ChangeServer from "./components/settings/ChangeServer"
import Helmet from "react-helmet"

export default class UnAuthenticatedMainMobile extends Component {
  state = { redirect: false, tapCounter: 0, changeServerOpen: false }

  render() {
    let link = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? localStorage.getItem("server") + "/graphql"
          : `https://igloo-production.herokuapp.com/graphql`,
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
              : "Igloo Aurora - Sign up"}
          </title>
        </Helmet>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0057cb",
            overflowX: "hidden",
          }}
        >
          <div style={{ marginRight: "32px", marginLeft: "32px" }}>
            {this.props.isLogin ? (
              <LoginMobile
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
            ) : (
              <SignupMobile
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
        <ChangeServer
          open={this.state.changeServerOpen}
          close={() => this.setState({ changeServerOpen: false })}
          forceUpdate={() => this.props.forceUpdate()}
          isUnauthenticated
        />
      </React.Fragment>
    )
  }
}
