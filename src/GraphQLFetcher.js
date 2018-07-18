import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { reactTranslateChangeLanguage } from "translate-components"

class GraphQLFetcher extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
          online
          deviceType
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.user.devices,
          subscriptionData.data.deviceCreated,
        ]
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })
  }

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    if (user) {
      switch (user.language) {
        case "en":
          reactTranslateChangeLanguage.bind(this, "en")
          break
        case "de":
          reactTranslateChangeLanguage.bind(this, "de")
          break
        case "es":
          reactTranslateChangeLanguage.bind(this, "es")
          break
        case "it":
          reactTranslateChangeLanguage.bind(this, "it")
          break
        case "zh-Hans":
          reactTranslateChangeLanguage.bind(this, "zh-Hans")
          break
      }
    }

    return this.props.isMobile ? (
      <MainMobile
        logOut={this.props.logOut}
        isMobile={this.props.isMobile}
        userData={this.props.userData}
      />
    ) : (
      <Main logOut={this.props.logOut} userData={this.props.userData} />
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        language
        nightMode
        devices {
          id
          customName
          icon
          online
          deviceType
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    }
  `,
  { name: "userData" }
)(GraphQLFetcher)
