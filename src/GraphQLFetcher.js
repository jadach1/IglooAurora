import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Switch, Route, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import Boards from "./Boards"
import queryString from "query-string"
import BoardsMobile from "./BoardsMobile"
import EmailNotVerified from "./components/EmailNotVerified"
import GenericDialog from "./components/GenericDialog"

class GraphQLFetcher extends Component {
  componentDidMount() {
    const boardSubscriptionQuery = gql`
      subscription {
        boardCreated {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
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

    const boardSharedWithYouSubscriptionQuery = gql`
      subscription {
        boardSharedWithYou {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: boardSharedWithYouSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newBoards = [
          ...prev.user.boards,
          subscriptionData.data.boardSharedWithYou,
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
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToBoardsUpdates,
    })

    const subscribeToBoardShareAccepted = gql`
      subscription {
        boardShareAccepted {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToBoardShareAccepted,
    })

    const subscribeToBoardShareDeclined = gql`
      subscription {
        boardShareDeclined {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToBoardShareDeclined,
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
          emailIsVerified
          name
          profileIconColor
          pendingBoardShares {
            id
            sender {
              id
              name
            }
            board {
              id
              name
            }
          }
          permanentTokens {
            id
            name
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
          name
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
          name
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
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
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
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
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
            forceUpdate={this.props.forceUpdate}
            client={this.props.client}
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
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
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
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
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
            forceUpdate={this.props.forceUpdate}
            client={this.props.client}
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
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        muted
        emailIsVerified
        name
        profileIconColor
        email
        pendingBoardShares {
          id
          sender {
            id
            name
          }
          board {
            id
            name
          }
        }
        boards {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingBoardShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            muted
            name
            board {
              myRole
            }
          }
          owner {
            id
            email
            name
            profileIconColor
          }
          admins {
            id
            email
            name
            profileIconColor
          }
          editors {
            id
            email
            name
            profileIconColor
          }
          spectators {
            id
            email
            name
            profileIconColor
          }
        }
      }
    }
  `,
  { name: "userData" }
)(GraphQLFetcher)
