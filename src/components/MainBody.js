import React, { Component } from "react"
import Card from "./cards/Card"
import CenteredSpinner from "./CenteredSpinner"
import Button from "@material-ui/core/Button"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Redirect } from "react-router-dom"
import querystringify from "querystringify"
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp"
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown"

class MainBody extends Component {
  componentDidMount() {
    const subscribeToNewValues = gql`
      subscription {
        valueCreated {
          id
          visibility
          cardSize
          name
          updatedAt
          createdAt
          myRole
          device {
            id
          }
          ... on FloatValue {
            floatValue: value
            precision
            min
            max
            permission
            unitOfMeasurement
          }
          ... on StringValue {
            stringValue: value
            maxChars
            allowedValues
            permission
          }
          ... on BooleanValue {
            boolValue: value
            permission
          }
          ... on PlotValue {
            plotValue: value {
              id
              value
              timestamp
            }
            unitOfMeasurement
            threshold
          }
        }
      }
    `

    this.props.deviceData.subscribeToMore({
      document: subscribeToNewValues,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        if (subscriptionData.data.valueCreated.device.id !== prev.device.id) {
          return prev
        }

        const newValues = [
          ...prev.device.values,
          subscriptionData.data.valueCreated,
        ]
        return {
          device: {
            ...prev.device,
            values: newValues,
          },
        }
      },
    })

    const subscribeToValueUpdates = gql`
      subscription {
        valueUpdated {
          id
          visibility
          unitOfMeasurement
          cardSize
          name
          updatedAt
          createdAt
          myRole
          device {
            id
          }
          ... on FloatValue {
            floatValue: value
            precision
            min
            max
            permission
            unitOfMeasurement
          }
          ... on StringValue {
            stringValue: value
            maxChars
            allowedValues
            permission
          }
          ... on BooleanValue {
            boolValue: value
            permission
          }
          ... on PlotValue {
            plotValue: value {
              id
              value
              timestamp
            }
            unitOfMeasurement
            threshold
          }
        }
      }
    `

    this.props.deviceData.subscribeToMore({
      document: subscribeToValueUpdates,
    })

    const subscribeToValuesDeletes = gql`
      subscription {
        valueDeleted
      }
    `

    this.props.deviceData.subscribeToMore({
      document: subscribeToValuesDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newValues = prev.device.values.filter(
          value => value.id !== subscriptionData.data.valueDeleted
        )

        return {
          device: {
            ...prev.device,
            values: newValues,
          },
        }
      },
    })
  }

  render() {
    const { loading, error, device } = this.props.deviceData

    if (loading) {
      return (
        <div
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? { background: "#2f333d", height: "100%" }
              : { background: "white", height: "100%" }
          }
        >
          <div
            className={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? this.props.isMobile
                  ? "mainBody mobileDarkMainBodyBG"
                  : "mainBody darkMainBodyBG"
                : this.props.isMobile
                ? "mainBody mobileMainBodyBG"
                : "mainBody mainBodyBG"
            }
            style={{
              width: "100%",
              height: "100%",
              paddingTop: "96px",
            }}
          >
            <CenteredSpinner large />
          </div>
        </div>
      )
    }

    if (error) {
      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut()
      }

      if (
        error.message === "GraphQL error: This id is not valid" ||
        error.message === "GraphQL error: The requested resource does not exist"
      ) {
        return (
          <Redirect
            to={
              "/?environment=" +
              querystringify.parse("?" + window.location.href.split("?")[1])
                .environment
            }
          />
        )
      }

      return (
        <div
          className={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? this.props.isMobile
                ? "mainBody darkMobileMainBodyBG"
                : "mainBody darkMainBodyBG"
              : this.props.isMobile
              ? "mainBody mobileMainBodyBG"
              : "mainBody mainBodyBG"
          }
        >
          An unexpected error occurred
        </div>
      )
    }

    const values = device.values
    let visibleCards = values.filter(value => value.visibility === "VISIBLE")

    let hiddenCards = values.filter(value => value.visibility === "HIDDEN")

    const renderCard = value => (
      <Card
        value={value}
        key={value.id}
        nightMode={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
        }
        devMode={this.props.devMode}
        environmentData={this.props.environmentData}
        userData={this.props.userData}
        environments={this.props.environments}
      />
    )

    visibleCards = visibleCards.map(renderCard)
    hiddenCards = hiddenCards.map(renderCard)

    let hiddenCardsUI = ""

    if (hiddenCards.length !== 0) {
      hiddenCardsUI = [
        <Button
          onClick={() => {
            this.props.changeShowHiddenState()
          }}
          fullWidth
          className="divider notSelectable"
          key="showMoreLessButton"
          style={
            this.props.showHidden
              ? typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                ? { backgroundColor: "#282c34", color: "white" }
                : { backgroundColor: "#d4d4d4", color: "black" }
              : typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
              ? { backgroundColor: "transparent", color: "white" }
              : { backgroundColor: "transparent", color: "black" }
          }
        >
          {this.props.showHidden ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          {this.props.showHidden ? "Show less" : "Show more"}
        </Button>,
        this.props.showHidden ? (
          <div className="itemsList hiddenItems" key="hiddenCardsContainer">
            {hiddenCards}
          </div>
        ) : (
          ""
        ),
      ]
    }

    let noItemsUI = ""
    if (hiddenCards.length + visibleCards.length === 0) {
      noItemsUI = (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "32px",
          }}
          key="noCardsUI"
          className="notSelectable"
        >
          This device has no values
        </div>
      )
    }

    //changes the environment id in the url so that it is the correct one for the device
    if (
      device.environment.id !==
      querystringify.parse("?" + window.location.href.split("?")[1]).environment
    ) {
      return (
        <Redirect
          to={"/?environment=" + device.environment.id + "&device=" + device.id}
        />
      )
    }

    return (
      <div
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? { background: "#2f333d", height: "calc(100vh - 112px)" }
            : { background: "white", height: "calc(100vh - 112px)" }
        }
      >
        <div
          className={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? this.props.isMobile
                ? "mainBody mobileDarkMainBodyBG"
                : "mainBody darkMainBodyBG"
              : this.props.isMobile
              ? "mainBody mobileMainBodyBG"
              : "mainBody mainBodyBG"
          }
          style={{ width: "100%", height: "100%", overflowX: "hidden" }}
        >
          {noItemsUI}
          <div className="itemsList" key="visibleCardsContainer">
            {visibleCards}
          </div>
          {hiddenCardsUI}
        </div>
      </div>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        batteryStatus
        batteryCharging
        signalStatus
        environment {
          id
        }
        values {
          id
          visibility
          cardSize
          name
          updatedAt
          createdAt
          myRole
          device {
            id
          }
          ... on FloatValue {
            floatValue: value
            precision
            min
            max
            permission
            unitOfMeasurement
          }
          ... on StringValue {
            stringValue: value
            maxChars
            allowedValues
            permission
          }
          ... on BooleanValue {
            boolValue: value
            permission
          }
          ... on PlotValue {
            plotValue: value {
              id
              value
              timestamp
            }
            unitOfMeasurement
            threshold
          }
        }
      }
    }
  `,
  {
    name: "deviceData",
    options: ({ deviceId }) => ({ variables: { id: deviceId } }),
  }
)(MainBody)
