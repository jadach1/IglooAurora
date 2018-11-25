import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { reactTranslateChangeLanguage } from "translate-components"
import { Switch, Route, Redirect } from "react-router-dom"
import Error404 from "./Error404"
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
          createdAt
          updatedAt
          notificationCount
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
          createdAt
          updatedAt
          notificationCount
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
          createdAt
          updatedAt
          notificationCount
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
          settings {
            language
          }
          emailIsVerified
          fullName
          profileIconColor
          permanentTokens {
            id
            customName
            lastUsed
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserUpdates,
    })

    const deviceSubscriptionQuery = gql`
      subscription {
        deviceCreated {
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
          notificationCount
          notifications {
            id
            content
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

    const subscribeToUserDeletes = gql`
      subscription {
        userDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        localStorage.setItem("bearer", "")
        sessionStorage.setItem("bearer", "")
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

  componentWillReceiveProps(nextProps) {
    if (
      this.props.userData.user &&
      nextProps.user &&
      typeof Storage !== "undefined"
    ) {
      if (this.props.userData.user.email !== nextProps) {
        localStorage.setItem("email", this.props.userData.user.email)
      }
    }
  }

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
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              devMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
              forceUpdate={() => this.forceUpdate()}
            />
          )
        } else {
          return (
            <Main
              logOut={this.props.logOut}
              userData={this.props.userData}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
              selectDevice={id => this.setState({ selectedDevice: id })}
              selectedDevice={null}
              selectBoard={id => this.setState({ selectedBoard: id })}
              boardId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .board
              }
              devMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              boards={
                this.props.userData.user && this.props.userData.user.boards
              }
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
              forceUpdate={() => this.forceUpdate()}
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
            areSettingsOpen={this.state.areSettingsOpen}
            boardsSearchText={this.state.boardsSearchText}
            forceUpdate={() => this.forceUpdate()}
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
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
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
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              forceUpdate={() => this.forceUpdate()}
            />
          )
        } else {
          return (
            <MainMobile
              logOut={this.props.logOut}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
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
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              searchDevices={text => {
                this.setState({ devicesSearchText: text })
              }}
              devicesSearchText={this.state.devicesSearchText}
              forceUpdate={() => this.forceUpdate()}
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
            areSettingsOpen={this.state.areSettingsOpen}
            boardsSearchText={this.state.boardsSearchText}
            forceUpdate={() => this.forceUpdate()}
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
          <Route render={() => <Error404 isMobile={this.props.isMobile} />} />
        </Switch>
        {user && !emailIsVerified && (
          <EmailNotVerified mobile={this.props.isMobile} />
        )}
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
        quietMode
        emailIsVerified
        fullName
        profileIconColor
        email
        boards {
          id
          index
          customName
          createdAt
          updatedAt
          quietMode
          avatar
          myRole
          devices {
            id
            quietMode
            customName
            icon
            board {
              myRole
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
    }
  `,
  { name: "userData" }
)(
  graphql(
    gql`
      mutation ChangeLanguage($language: String) {
        settings(language: $language) {
          language
        }
      }
    `,
    {
      name: "ChangeLanguage",
    }
  )(GraphQLFetcher)
)
