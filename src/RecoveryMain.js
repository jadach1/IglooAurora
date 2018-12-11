import React, { Component } from "react"
import PasswordRecovery from "./PasswordRecovery"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import jwtDecode from "jwt-decode"
import Helmet from "react-helmet"

class RecoveryMain extends Component {
  state = { recoveryPassword: "", decodeToken: jwtDecode(this.props.token) }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora - Password recovery</title>
        </Helmet>
        <PasswordRecovery
          password={this.state.recoveryPassword}
          updatePassword={password =>
            this.setState({ recoveryPassword: password })
          }
          userData={this.props.userData}
          isTokenValid={
            this.state.decodeToken.tokenType !== "PASSWORD_RECOVERY"
          }
          client={this.props.client}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        name
        email
      }
    }
  `,
  { name: "userData" }
)(RecoveryMain)
