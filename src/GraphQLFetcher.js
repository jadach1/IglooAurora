import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { reactTranslateChangeLanguage } from "translate-components"
import { Switch, Route, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import MobileError404 from "./MobileError404"
import Boards from "./Boards"
import queryString from "query-string"
import BoardsMobile from "./BoardsMobile"

let systemLang = navigator.language || navigator.userLanguage

class GraphQLFetcher extends Component {
  componentDidMount() {
    const deviceSubscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
          online
          batteryStatus
          signalStatus
          deviceType
          batteryCharging
          board {
            id
          }
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
      document: deviceSubscriptionQuery,
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

    const subscribeToDevicesUpdates = gql`
      subscription {
        deviceUpdated {
          id
          customName
          icon
          online
          batteryStatus
          signalStatus
          deviceType
          batteryCharging
          board {
            id
          }
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
      document: subscribeToDevicesUpdates,
    })

    const subscribeToDevicesDeletes = gql`
      subscription {
        deviceDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToDevicesDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = prev.user.devices.filter(
          device => device.id !== subscriptionData.data.deviceDeleted
        )

        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })

    const boardSubscriptionQuery = gql`
      subscription {
        boardCreated {
          id
          index
          customName
          favorite
          createdAt
          updatedAt
          notificationsCount
          quietMode
          avatar
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: boardSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newBoards = [
          ...prev.user.boards,
          subscriptionData.data.boardCreated,
        ]
        return {
          user: {
            ...prev.user,
            boards: newBoards,
          },
        }
      },
    })

    const subscribeToBoardsUpdates = gql`
      subscription {
        boardUpdated {
          id
          index
          customName
          favorite
          createdAt
          updatedAt
          notificationsCount
          quietMode
          avatar
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToBoardsUpdates,
    })

    const subscribeToBoardsDeletes = gql`
      subscription {
        boardDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToBoardsDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newBoards = prev.user.boards.filter(
          board => board.id !== subscriptionData.data.boardDeleted
        )

        return {
          user: {
            ...prev.user,
            boards: newBoards,
          },
        }
      },
    })

    const subscribeToUserUpdates = gql`
      subscription {
        userUpdated {
          id
          language
          nightMode
          devMode
          emailIsVerified
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserUpdates,
    })

    const tokenSubscriptionQuery = gql`
      subscription {
        tokenCreated {
          id
          customName
          lastUsed
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: tokenSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newTokens = [
          ...prev.user.permanentTokens,
          subscriptionData.data.tokenCreated,
        ]
        return {
          user: {
            ...prev.user,
            permanentTokens: newTokens,
          },
        }
      },
    })

    const subscribeToTokensDeletes = gql`
      subscription {
        tokenDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToTokensDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newTokens = prev.user.permanentTokens.filter(
          token => token.id !== subscriptionData.data.tokenDeleted
        )

        return {
          user: {
            ...prev.user,
            permanentTokens: newTokens,
          },
        }
      },
    })
  }

  state = {
    selectedDevice: null,
    selectedBoard: null,
    goToDevices: false,
  }

  selectDevice = id => this.setState({ selectedDevice: id })

  render() {
    const {
      userData: { user },
    } = this.props

    let changeLanguage = () => {}

    if (user) {
      changeLanguage = language =>
        this.props.ChangeLanguage({
          variables: {
            language,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              language,
              __typename: "User",
            },
          },
        })

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
        default:
          switch (systemLang) {
            case "en":
              changeLanguage("en")
              break
            case "de":
              changeLanguage("de")
              break
            case "es":
              changeLanguage("es")
              break
            case "it":
              changeLanguage("it")
              break
            case "zh-Hans":
              changeLanguage("zh-Hans")
              break
            default:
              changeLanguage("en")
              break
          }
          break
      }
    }

    const MainSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1]).board ||
        queryString.parse("?" + window.location.href.split("?")[1]).device
      ) {
        if (
          queryString.parse("?" + window.location.href.split("?")[1]).device
        ) {
          return (
            <Main
              logOut={this.props.logOut}
              userData={this.props.userData}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .device
              }
              selectBoard={id => this.setState({ selectedBoard: id })}
              selectedBoard={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
            />
          )
        } else {
          return (
            <Main
              logOut={this.props.logOut}
              userData={this.props.userData}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={null}
              selectBoard={id => this.setState({ selectedBoard: id })}
              selectedBoard={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
            />
          )
        }
      } else {
        return this.props.isMobile ? (
          <BoardsMobile
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
          />
        ) : (
          <Boards
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
          />
        )
      }
    }

    const MainMobileSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1]).board ||
        queryString.parse("?" + window.location.href.split("?")[1]).device
      ) {
        if (
          queryString.parse("?" + window.location.href.split("?")[1]).device
        ) {
          return (
            <MainMobile
              logOut={this.props.logOut}
              userData={this.props.userData}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .device
              }
              selectBoard={id => this.setState({ selectedBoard: id })}
              selectedBoard={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
            />
          )
        } else {
          return (
            <MainMobile
              logOut={this.props.logOut}
              userData={this.props.userData}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={null}
              selectBoard={id => this.setState({ selectedBoard: id })}
              selectedBoard={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
            />
          )
        }
      } else {
        return this.props.isMobile ? (
          <BoardsMobile
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
          />
        ) : (
          <Boards
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
          />
        )
      }
    }

    return (
      <React.Fragment>
        <Switch>
          <Route
            exact
            strict
            path="/dashboard"
            component={this.props.isMobile ? MainMobileSelected : MainSelected}
          />
          <Route
            exact
            path="/dashboard/"
            component={() => <Redirect to="/dashboard" />}
          />
          <Route
            render={() =>
              this.props.isMobile ? <MobileError404 /> : <Error404 />
            }
          />
        </Switch>
      </React.Fragment>
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
        devMode
        quietMode
        emailIsVerified
        permanentTokens {
          id
          customName
          lastUsed
        }
        boards {
          id
          index
          customName
          favorite
          createdAt
          updatedAt
          notificationsCount
          quietMode
          avatar
        }
        devices {
          id
          customName
          icon
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          board {
            id
          }
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
)(
  graphql(
    gql`
      mutation ChangeLanguage($language: String) {
        user(language: $language) {
          id
          language
        }
      }
    `,
    {
      name: "ChangeLanguage",
    }
  )(GraphQLFetcher)
)
