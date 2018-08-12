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

let systemLang = navigator.language || navigator.userLanguage

class GraphQLFetcher extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
          online
          batteryStatus
          signalStatus
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
        return (
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
        return (
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
        emailIsVerified
        boards {
          id
          customName
        }
        devices {
          id
          customName
          icon
          online
          batteryStatus
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
