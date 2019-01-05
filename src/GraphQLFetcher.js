import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Switch, Route } from "react-router-dom"
import Error404 from "./Error404"
import Environments from "./Environments"
import queryString from "query-string"
import EmailNotVerified from "./components/EmailNotVerified"
import GenericDialog from "./components/GenericDialog"

class GraphQLFetcher extends Component {
  componentDidMount() {
    const environmentSubscriptionQuery = gql`
      subscription {
        environmentCreated {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingEnvironmentShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          pendingOwnerChanges {
            id
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
            environment {
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
      document: environmentSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = [
          ...prev.user.environments,
          subscriptionData.data.environmentCreated,
        ]

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
          },
        }
      },
    })

    const subscribeToEnvironmentsUpdates = gql`
      subscription {
        environmentUpdated {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingEnvironmentShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
            sender {
              id
              profileIconColor
              name
              email
            }
          }
          pendingOwnerChanges {
            id
            receiver {
              id
              profileIconColor
              name
              email
            }
            sender {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            index
            muted
            name
            environment {
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
      document: subscribeToEnvironmentsUpdates,
    })

    const subscribeToEnvironmentsDeletes = gql`
      subscription {
        environmentDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToEnvironmentsDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = prev.user.environments.filter(
          environment =>
            environment.id !== subscriptionData.data.environmentDeleted
        )

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
          },
        }
      },
    })

    const environmentSharedWithYouSubscriptionQuery = gql`
      subscription {
        environmentShareReceived {
          id
          receiver {
            id
            profileIconColor
            name
            email
          }
          sender {
            id
            name
          }
          environment {
            id
            name
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: environmentSharedWithYouSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironmentsShares = [
          ...prev.user.pendingEnvironmentShares,
          subscriptionData.data.environmentShareReceived,
        ]

        return {
          user: {
            ...prev.user,
            pendingEnvironmentShares: newEnvironmentsShares,
          },
        }
      },
    })

    const subscribeToEnvironmentShareAccepted = gql`
      subscription {
        environmentShareAccepted {
          id
          environment {
            id
            index
            name
            createdAt
            updatedAt
            muted
            avatar
            myRole
            pendingEnvironmentShares {
              id
              role
              receiver {
                id
                profileIconColor
                name
                email
              }
              sender {
                id
                profileIconColor
                name
                email
              }
            }
            pendingOwnerChanges {
              id
              receiver {
                id
                profileIconColor
                name
                email
              }
              sender {
                id
                profileIconColor
                name
                email
              }
            }
            devices {
              id
              index
              muted
              name
              environment {
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
    `

    this.props.userData.subscribeToMore({
      document: subscribeToEnvironmentShareAccepted,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = [
          ...prev.user.environments,
          subscriptionData.data.environmentShareAccepted.environment,
        ]

        const newEnvironmentShares = prev.user.pendingEnvironmentShares.filter(
          pendingEnvironmentShare =>
            pendingEnvironmentShare.id !==
            subscriptionData.data.environmentShareAccepted.id
        )

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
            pendingEnvironmentShares: newEnvironmentShares,
          },
        }
      },
    })

    const subscribeToEnvironmentShareUpdated = gql`
      subscription {
        environmentShareUpdated {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingEnvironmentShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
          }
          pendingOwnerChanges {
            id
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
            environment {
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
      document: subscribeToEnvironmentShareUpdated,
    })

    const subscribeToEnvironmentShareDeclined = gql`
      subscription {
        environmentShareDeclined
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToEnvironmentShareDeclined,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironmentShares = prev.user.pendingEnvironmentShares.filter(
          pendingEnvironmentShare =>
            pendingEnvironmentShare.id !==
            subscriptionData.data.environmentShareDeclined
        )

        return {
          user: {
            ...prev.user,
            pendingEnvironmentShares: newEnvironmentShares,
          },
        }
      },
    })

    const subscribeToEnvironmentStoppedSharing = gql`
      subscription {
        environmentStoppedSharingWithYou
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToEnvironmentStoppedSharing,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = prev.user.environments.filter(
          environment =>
            environment.id !==
            subscriptionData.data.environmentStoppedSharingWithYou
        )

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
          },
        }
      },
    })

    const subscribeToOwnerChangeReceived = gql`
      subscription {
        ownerChangeReceived {
          id
          receiver {
            id
            profileIconColor
            name
            email
          }
          sender {
            id
            name
          }
          environment {
            id
            name
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToOwnerChangeReceived,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newOwnerChange = [
          ...prev.user.pendingOwnerChanges,
          subscriptionData.data.ownerChangeReceived,
        ]

        return {
          user: {
            ...prev.user,
            pendingOwnerChanges: newOwnerChange,
          },
        }
      },
    })

    const subscribeToOwnerChangeAccepted = gql`
      subscription {
        ownerChangeAccepted {
          id
          environment {
            id
            index
            name
            createdAt
            updatedAt
            muted
            avatar
            myRole
            pendingEnvironmentShares {
              id
              role
              receiver {
                id
                profileIconColor
                name
                email
              }
              sender {
                id
                profileIconColor
                name
                email
              }
            }
            pendingOwnerChanges {
              id
              receiver {
                id
                profileIconColor
                name
                email
              }
              sender {
                id
                profileIconColor
                name
                email
              }
            }
            devices {
              id
              index
              muted
              name
              environment {
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
    `

    this.props.userData.subscribeToMore({
      document: subscribeToOwnerChangeAccepted,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = [
          ...prev.user.environments,
          subscriptionData.data.ownerChangeAccepted.environment,
        ]

        const newOwnerChanges = prev.user.pendingOwnerChanges.filter(
          pendingOwnerChange =>
            pendingOwnerChange.id !==
            subscriptionData.data.ownerChangeAccepted.id
        )

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
            pendingOwnerChanges: newOwnerChanges,
          },
        }
      },
    })

    const subscribeToEnvironmentShareRevoked = gql`
      subscription {
        environmentShareRevoked
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToEnvironmentShareRevoked,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironmentShares = prev.user.pendingEnvironmentShares.filter(
          pendingEnvironmentShare =>
            pendingEnvironmentShare.id !==
            subscriptionData.data.environmentShareRevoked
        )

        return {
          user: {
            ...prev.user,
            pendingEnvironmentShares: newEnvironmentShares,
          },
        }
      },
    })

    const subscribeToOwnerChangeDeclined = gql`
      subscription {
        ownerChangeDeclined
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToOwnerChangeDeclined,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newOwnerChanges = prev.user.pendingOwnerChanges.filter(
          pendingOwnerChange =>
            pendingOwnerChange.id !== subscriptionData.data.ownerChangeDeclined
        )

        return {
          user: {
            ...prev.user,
            pendingOwnerChanges: newOwnerChanges,
          },
        }
      },
    })

    const subscribeToOwnerChangeRevoked = gql`
      subscription {
        ownerChangeRevoked
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToOwnerChangeRevoked,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newOwnerChanges = prev.user.pendingOwnerChanges.filter(
          pendingOwnerChange =>
            pendingOwnerChange.id !== subscriptionData.data.ownerChangeRevoked
        )

        return {
          user: {
            ...prev.user,
            pendingOwnerChanges: newOwnerChanges,
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
          pendingEnvironmentShares {
            id
            sender {
              id
              name
            }
            environment {
              id
              name
            }
          }
          settings {
            timeFormat
            dateFormat
            lengthAndMass
            temperature
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserUpdates,
    })

    const subscribeToUserDeleted = gql`
      subscription {
        userDeleted
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToUserDeleted,
      updateQuery: (prev, { subscriptionData }) => {
        this.props.logOut()
      },
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

    const deviceMovedSubscriptionQuery = gql`
      subscription {
        deviceMoved {
          id
          index
          muted
          name
          environment {
            myRole
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: deviceMovedSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = [
          ...prev.user.devices,
          subscriptionData.data.deviceMoved,
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

  state = {
    selectedDevice: null,
    selectedEnvironment: null,
    goToDevices: false,
    environmentsSearchText: "",
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
      if (
        this.props.userData.user.email !== "undefined" &&
        this.props.userData.user.email !== nextProps.userData.user.email
      ) {
        localStorage.setItem("email", this.props.userData.user.email)
      }
    }
  }

  render() {
    const {
      userData: { error, user },
    } = this.props

    let emailIsVerified = true

    if (error) {
      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut()
      }

      console.log(error.message)
    }

    if (user) {
      emailIsVerified = user.emailIsVerified
    }

    const MainSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1])
          .environment ||
        queryString.parse("?" + window.location.href.split("?")[1]).device
      ) {
        if (
          queryString.parse("?" + window.location.href.split("?")[1]).device
        ) {
          return (
            <React.Fragment>
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
                selectEnvironment={id =>
                  this.setState({ selectedEnvironment: id })
                }
                environmentId={
                  queryString.parse("?" + window.location.href.split("?")[1])
                    .environment
                }
                devMode={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("devMode") === "true"
                }
                environments={
                  this.props.userData.user &&
                  this.props.userData.user.environments
                }
                searchDevices={text => {
                  this.setState({ devicesSearchText: text })
                }}
                devicesSearchText={this.state.devicesSearchText}
                forceUpdate={this.props.forceUpdate}
                client={this.props.client}
              />
              {user && !emailIsVerified && (
                <EmailNotVerified mobile={this.props.isMobile} />
              )}
              <GenericDialog />
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment>
              <Main
                logOut={this.props.logOut}
                userData={this.props.userData}
                openSettings={() => this.setState({ areSettingsOpen: true })}
                closeSettings={() => this.setState({ areSettingsOpen: false })}
                areSettingsOpen={this.state.areSettingsOpen}
                selectDevice={id => this.setState({ selectedDevice: id })}
                selectedDevice={null}
                selectEnvironment={id =>
                  this.setState({ selectedEnvironment: id })
                }
                environmentId={
                  queryString.parse("?" + window.location.href.split("?")[1])
                    .environment
                }
                devMode={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("devMode") === "true"
                }
                environments={
                  this.props.userData.user &&
                  this.props.userData.user.environments
                }
                searchDevices={text => {
                  this.setState({ devicesSearchText: text })
                }}
                devicesSearchText={this.state.devicesSearchText}
                forceUpdate={this.props.forceUpdate}
                client={this.props.client}
              />
              {user && !emailIsVerified && (
                <EmailNotVerified mobile={this.props.isMobile} />
              )}
              <GenericDialog />
            </React.Fragment>
          )
        }
      } else {
        return (
          <React.Fragment>
            <Environments
              userData={this.props.userData}
              logOut={this.props.logOut}
              selectEnvironment={id =>
                this.setState({ selectedEnvironment: id })
              }
              searchEnvironments={text => {
                this.setState({ environmentsSearchText: text })
              }}
              settingsOpen={this.state.areSettingsOpen}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
              environmentsSearchText={this.state.environmentsSearchText}
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
              mobile={this.props.isMobile}
            />
            {user && !emailIsVerified && (
              <EmailNotVerified mobile={this.props.isMobile} />
            )}
            <GenericDialog />
          </React.Fragment>
        )
      }
    }

    const MainMobileSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1])
          .environment ||
        queryString.parse("?" + window.location.href.split("?")[1]).device
      ) {
        if (
          queryString.parse("?" + window.location.href.split("?")[1]).device
        ) {
          return (
            <React.Fragment>
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
                environments={
                  this.props.userData.user &&
                  this.props.userData.user.environments
                }
                selectEnvironment={id =>
                  this.setState({ selectedEnvironment: id })
                }
                environmentId={
                  queryString.parse("?" + window.location.href.split("?")[1])
                    .environment
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
              {user && !emailIsVerified && (
                <EmailNotVerified mobile={this.props.isMobile} />
              )}
              <GenericDialog />
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment>
              <MainMobile
                logOut={this.props.logOut}
                openSettings={() => this.setState({ areSettingsOpen: true })}
                closeSettings={() => this.setState({ areSettingsOpen: false })}
                areSettingsOpen={this.state.areSettingsOpen}
                userData={this.props.userData}
                selectDevice={id => this.setState({ selectedDevice: id })}
                selectedDevice={null}
                selectEnvironment={id =>
                  this.setState({ selectedEnvironment: id })
                }
                environmentId={
                  queryString.parse("?" + window.location.href.split("?")[1])
                    .environment
                }
                environments={
                  this.props.userData.user &&
                  this.props.userData.user.environments
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
              {user && !emailIsVerified && (
                <EmailNotVerified mobile={this.props.isMobile} />
              )}
              <GenericDialog />
            </React.Fragment>
          )
        }
      } else {
        return (
          <React.Fragment>
            <Environments
              userData={this.props.userData}
              logOut={this.props.logOut}
              selectEnvironment={id =>
                this.setState({ selectedEnvironment: id })
              }
              searchEnvironments={text => {
                this.setState({ environmentsSearchText: text })
              }}
              settingsOpen={this.state.areSettingsOpen}
              openSettings={() => this.setState({ areSettingsOpen: true })}
              closeSettings={() => this.setState({ areSettingsOpen: false })}
              areSettingsOpen={this.state.areSettingsOpen}
              environmentsSearchText={this.state.environmentsSearchText}
              forceUpdate={this.props.forceUpdate}
              client={this.props.client}
              mobile={this.props.isMobile}
            />
            {user && !emailIsVerified && (
              <EmailNotVerified mobile={this.props.isMobile} />
            )}
            <GenericDialog />
          </React.Fragment>
        )
      }
    }

    return (
      <Switch>
        <Route
          exact
          strict
          path="/"
          render={this.props.isMobile ? MainMobileSelected : MainSelected}
        />
        <Route render={() => <Error404 isMobile={this.props.isMobile} />} />
      </Switch>
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
        name
        profileIconColor
        email
        pendingEnvironmentShares {
          id
          receiver {
            id
            profileIconColor
            name
            email
          }
          sender {
            id
            name
          }
          environment {
            id
            name
          }
        }
        pendingOwnerChanges {
          id
          receiver {
            id
            profileIconColor
            name
            email
          }
          sender {
            id
            name
          }
          environment {
            id
            name
          }
        }
        settings {
          timeFormat
          dateFormat
          lengthAndMass
          temperature
        }
        environments {
          id
          index
          name
          createdAt
          updatedAt
          muted
          avatar
          myRole
          pendingEnvironmentShares {
            id
            role
            receiver {
              id
              profileIconColor
              name
              email
            }
            sender {
              id
              profileIconColor
              name
              email
            }
          }
          pendingOwnerChanges {
            id
            receiver {
              id
              profileIconColor
              name
              email
            }
            sender {
              id
              profileIconColor
              name
              email
            }
          }
          devices {
            id
            index
            muted
            name
            deviceType
            environment {
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
