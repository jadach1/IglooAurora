import React, { Component } from "react"
import Main from "./Main"
import MainMobile from "./MainMobile"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Switch, Route, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import Environments from "./Environments"
import queryString from "query-string"
import EnvironmentsMobile from "./EnvironmentsMobile"
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
          environment => environment.id !== subscriptionData.data.environmentDeleted
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
        environmentSharedWithYou {
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
          subscriptionData.data.environmentSharedWithYou,
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
      document: subscribeToEnvironmentShareAccepted,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newEnvironments = [
          ...prev.user.environments,
          subscriptionData.data.environmentShareAccepted,
        ]

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
          },
        }
      },
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
            pendingEnvironmentShare.id !== subscriptionData.data.environmentShareDeclined
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
          environment => environment.id !== subscriptionData.data.environmentStoppedSharingWithYou
        )

        return {
          user: {
            ...prev.user,
            environments: newEnvironments,
          },
        }
      },
    })

    const subscribeToOwnerChangeBegan = gql`
      subscription {
        ownerChangeBegan {
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
      }
    `

    this.props.userData.subscribeToMore({
      document: subscribeToOwnerChangeBegan,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newOwnerChange = prev.user.pendingOwnerChanges.filter(
          ownerChange =>
            ownerChange.id !== subscriptionData.data.ownerChangeBegan
        )

        return {
          user: {
            ...prev.user,
            pendingOwnerChanges: newOwnerChange,
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
            pendingEnvironmentShare.id !== subscriptionData.data.environmentShareRevoked
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
      userData: { user },
    } = this.props

    let emailIsVerified = true

    if (user) {
      emailIsVerified = user.emailIsVerified
    }

    const MainSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1]).environment ||
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
              selectEnvironment={id => this.setState({ selectedEnvironment: id })}
              environmentId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .environment
              }
              devMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              environments={
                this.props.userData.user && this.props.userData.user.environments
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
              selectEnvironment={id => this.setState({ selectedEnvironment: id })}
              environmentId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .environment
              }
              devMode={
                typeof Storage !== "undefined" &&
                localStorage.getItem("devMode") === "true"
              }
              environments={
                this.props.userData.user && this.props.userData.user.environments
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
          <Environments
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectEnvironment={id => this.setState({ selectedEnvironment: id })}
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
          />
        )
      }
    }

    const MainMobileSelected = () => {
      if (
        queryString.parse("?" + window.location.href.split("?")[1]).environment ||
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
              environments={
                this.props.userData.user && this.props.userData.user.environments
              }
              selectEnvironment={id => this.setState({ selectedEnvironment: id })}
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
              selectEnvironment={id => this.setState({ selectedEnvironment: id })}
              environmentId={
                queryString.parse("?" + window.location.href.split("?")[1])
                  .environment
              }
              environments={
                this.props.userData.user && this.props.userData.user.environments
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
          <EnvironmentsMobile
            userData={this.props.userData}
            logOut={this.props.logOut}
            selectEnvironment={id => this.setState({ selectedEnvironment: id })}
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
