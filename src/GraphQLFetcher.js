import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { reactTranslateChangeLanguage } from "translate-components"
import { Switch, Route, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import MobileError404 from "./Error404Mobile"
import Boards from "./Boards"
import queryString from "query-string"
import BoardsMobile from "./BoardsMobile"
import EmailNotVerified from "./components/EmailNotVerified"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import GenericDialog from "./components/GenericDialog"

let systemLang = navigator.language || navigator.userLanguage

class GraphQLFetcher extends Component {
  componentDidMount() {
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
          myRole
          devices {
            id
            index
            customName
            icon
            online
            batteryStatus
            batteryCharging
            signalStatus
            deviceType
            createdAt
            updatedAt
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
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
          }
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

    const boardSharedSubscriptionQuery = gql`
      subscription {
        boardShared {
          id
          index
          customName
          favorite
          createdAt
          updatedAt
          notificationsCount
          quietMode
          avatar
          myRole
          devices {
            id
            index
            customName
            icon
            online
            batteryStatus
            batteryCharging
            signalStatus
            deviceType
            createdAt
            updatedAt
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
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: boardSharedSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newBoards = [
          ...prev.user.boards,
          subscriptionData.data.boardShared,
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
          myRole
          devices {
            id
            index
            customName
            icon
            online
            batteryStatus
            batteryCharging
            signalStatus
            deviceType
            createdAt
            updatedAt
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
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
          }
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
          fullName
          profileIconColor
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserUpdates,
    })

    const tokenSubscriptionQuery = gql`
      subscription {
        permanentTokenCreated {
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
          subscriptionData.data.permanentTokenCreated,
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
        permanentTokenDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToTokensDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newTokens = prev.user.permanentTokens.filter(
          token => token.id !== subscriptionData.data.permanentTokenDeleted
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
    boardsSearchText: "",
    devicesSearchText: "",
    areSettingsOpen: false,
  }

  selectDevice = id => this.setState({ selectedDevice: id })

  render() {
    const {
      userData: { user },
    } = this.props

    let emailIsVerified = true

    if (user) {
      emailIsVerified = user.emailIsVerified
    }

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
              openSettings={() => this.setState({ areSettingsOpen: true })}
              areSettingsOpen={this.state.areSettingsOpen}
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              devMode={
                this.props.userData.user && this.props.userData.user.devMode
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
            />
          )
        } else {
          return (
            <Main
              areSettingsOpen={this.state.areSettingsOpen}
              logOut={this.props.logOut}
              userData={this.props.userData}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={null}
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              devMode={
                this.props.userData.user && this.props.userData.user.devMode
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
            />
          )
        }
      } else {
        return (
          <Boards
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
            searchBoards={text => {
              this.setState({ boardsSearchText: text })
            }}
            settingsOpen={this.state.areSettingsOpen}
            openSettings={() => this.setState({ areSettingsOpen: true })}
            closeSettings={() => this.setState({ areSettingsOpen: false })}
            boardsSearchText={this.state.boardsSearchText}
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
              areSettingsOpen={this.state.areSettingsOpen}
              logOut={this.props.logOut}
              userData={this.props.userData}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .device
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
              devMode={
                this.props.userData.user && this.props.userData.user.devMode
              }
            />
          )
        } else {
          return (
            <MainMobile
              areSettingsOpen={this.state.areSettingsOpen}
              logOut={this.props.logOut}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              userData={this.props.userData}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={null}
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              devMode={
                this.props.userData.user && this.props.userData.user.devMode
              }
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
            />
          )
        }
      } else {
        return (
          <BoardsMobile
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectBoard={id => this.setState({ selectedBoard: id })}
            searchBoards={text => {
              this.setState({ boardsSearchText: text })
            }}
            settingsOpen={this.state.areSettingsOpen}
            openSettings={() => this.setState({ areSettingsOpen: true })}
            closeSettings={() => this.setState({ areSettingsOpen: false })}
            boardsSearchText={this.state.boardsSearchText}
          />
        )
      }
    }

    return (
      <MuiThemeProvider>
        <Switch>
          <Route
            exact
            strict
            path="/dashboard"
            render={this.props.isMobile ? MainMobileSelected : MainSelected}
          />
          <Route
            exact
            path="/dashboard/"
            render={() => <Redirect to="/dashboard" />}
          />
          <Route
            render={() =>
              this.props.isMobile ? <MobileError404 /> : <Error404 />
            }
          />
        </Switch>
        {!emailIsVerified && <EmailNotVerified mobile={this.props.isMobile} />}
        <GenericDialog />
      </MuiThemeProvider>
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
        fullName
        profileIconColor
        email
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
          myRole
          devices {
            id
            quietMode
            customName
            icon
          }
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
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
