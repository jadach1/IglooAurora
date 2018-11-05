import React, { Component } from "react"
import PasswordRecovery from "./PasswordRecovery"
import MobilePasswordRecovery from "./PasswordRecoveryMobile"
import gql from "graphql-tag"
import { graphql } from "react-apollo"
import jwtDecode from "jwt-decode"

class RecoveryMain extends Component {
  state = { recoveryPassword: "", decodeToken: jwtDecode(this.props.token) }

  render() {
    return this.props.mobile ? (
      <MobilePasswordRecovery
        password={this.state.recoveryPassword}
        updatePassword={password =>
          this.setState({ recoveryPassword: password })
        }
        userData={this.props.userData}
        isTokenValid={this.state.decodeToken.tokenType !== "PASSWORD_RECOVERY"}
      />
    ) : (
      <PasswordRecovery
        password={this.state.recoveryPassword}
        updatePassword={password =>
          this.setState({ recoveryPassword: password })
        }
        userData={this.props.userData}
        isTokenValid={this.state.decodeToken.tokenType !== "PASSWORD_RECOVERY"}
      />
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        fullName
        email
      }
    }
  `,
  { name: "userData" }
)(RecoveryMain)
