import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "@material-ui/core/Paper"
import Login from "./components/unauthenticated/Login"
import logo from "./styles/assets/logo.svg"
import iglooTitle from "./styles/assets/iglooTitle.svg"
import { Redirect } from "react-router-dom"
import Helmet from "react-helmet"

class UnAuthenticatedApp extends Component {
  state = { redirect: false, tapCounter: 0 }

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

  handleChange = (event, value) => {
    this.setState({ slideIndex: value })
  }

  handleChangeIndex = index => {
    this.setState({ slideIndex: index })
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora - Log in</title>
        </Helmet>
        <div className={this.props.unauthenticatedPicture}>
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
                  onClick={() =>
                    this.setState(oldState => ({
                      tapCounter: oldState.tapCounter++,
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
            <Login
              client={this.client}
              isDialog={false}
              signIn={this.props.signIn}
              setBoards={this.props.setBoards}
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
          </Paper>
        </div>
        {this.props.redirect && <Redirect to="/signup" />}
      </React.Fragment>
    )
  }
}

export default UnAuthenticatedApp
