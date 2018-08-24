import React, { Component } from "react"
import PasswordRecovery from "./PasswordRecovery"
import MobilePasswordRecovery from "./MobilePasswordRecovery"
import gql from "graphql-tag"
import { graphql } from "react-apollo"

class RecoveryMain extends Component {
  state = { recoveryPassword: "" }

  render() {
    return this.props.mobile ? (
      <MobilePasswordRecovery
        password={this.state.recoveryPassword}
        updatePassword={password =>
          this.setState({ recoveryPassword: password })
        }
        userData={this.props.userData}
      />
    ) : (
      <PasswordRecovery
        password={this.state.recoveryPassword}
        updatePassword={password =>
          this.setState({ recoveryPassword: password })
        }
        userData={this.props.userData}
      />
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        displayName
        email
      }
    }
  `,
  { name: "userData" }
)(RecoveryMain)
