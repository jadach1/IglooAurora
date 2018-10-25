import React, { Component } from "react"
import Tile from "./tiles/Tile"
import LargeCenteredSpinner from "./LargeCenteredSpinner"
import FlatButton from "material-ui/FlatButton"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Icon from "@material-ui/core/Icon"

class MainBody extends Component {
  componentDidMount() {
    const subscribeToNewValues = gql`
      subscription {
        valueCreated {
          id
          myRole
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
          values {
            id
            permission
            visibility
            valueDetails
            tileSize
            customName
            updatedAt
            createdAt
            device {
              id
            }
            ... on FloatValue {
              floatValue: value
              precision
              boundaries
            }
            ... on StringValue {
              stringValue: value
              maxChars
              allowedValues
            }
            ... on BooleanValue {
              boolValue: value
            }
            ... on ColourValue {
              colourValue: value
              allowedValues
            }
            ... on PlotValue {
              plotValue: value {
                id
                value
                timestamp
              }
            }
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
          myRole
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
          values {
            id
            permission
            visibility
            valueDetails
            tileSize
            customName
            updatedAt
            createdAt
            device {
              id
            }
            ... on FloatValue {
              floatValue: value
              precision
              boundaries
            }
            ... on StringValue {
              stringValue: value
              maxChars
              allowedValues
            }
            ... on BooleanValue {
              boolValue: value
            }
            ... on ColourValue {
              colourValue: value
              allowedValues
            }
            ... on PlotValue {
              plotValue: value {
                id
                value
                timestamp
              }
            }
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
                ? "mainBody darkMainBodyBG"
                : "mainBody mainBodyBG"
            }
            style={{ width: "100%", height: "100%" }}
          >
            <LargeCenteredSpinner />
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div
          className={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? "mainBody darkMainBodyBG"
              : "mainBody mainBodyBG"
          }
        >
          An unexpected error occurred
        </div>
      )
    }

    const values = device.values
    let visibleTiles = values.filter(value => value.visibility === "VISIBLE")

    let hiddenTiles = values.filter(value => value.visibility === "HIDDEN")

    const renderTile = value => (
      <Tile
        value={value}
        key={value.id}
        nightMode={typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"}
        devMode={this.props.devMode}
        userData={this.props.userData}
      />
    )

    visibleTiles = visibleTiles.map(renderTile)
    hiddenTiles = hiddenTiles.map(renderTile)

    let hiddenTilesUI = ""

    if (hiddenTiles.length !== 0) {
      hiddenTilesUI = [
        <FlatButton
          onClick={() => {
            this.props.changeShowHiddenState()
          }}
          label={this.props.showHidden ? "Show less" : "Show more"}
          icon={
            this.props.showHidden ? (
              <Icon>keyboard_arrow_up</Icon>
            ) : (
              <Icon>keyboard_arrow_down</Icon>
            )
          }
          fullWidth={true}
          className="divider notSelectable"
          key="showMoreLessButton"
          style={
            this.props.showHidden
              ? typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                ? { backgroundColor: "#282c34", color: "white" }
                : { backgroundColor: "#d4d4d4", color: "black" }
              : typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
                ? { backgroundColor: "transparent", color: "white" }
                : { backgroundColor: "transparent", color: "black" }
          }
        />,
        <div className="itemsList hiddenItems" key="hiddenTilesContainer">
          {this.props.showHidden ? hiddenTiles : ""}
        </div>,
      ]
    }

    let noItemsUI = ""
    if (hiddenTiles.length + visibleTiles.length === 0) {
      noItemsUI = (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "32px",
          }}
          key="noTilesUI"
          className="notSelectable"
        >
          This device has no values
        </div>
      )
    }

    return (
      <div
        style={
          typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
            ? { background: "#2f333d", height: "calc(100vh - 96px)" }
            : { background: "white", height: "calc(100vh - 96px)" }
        }
      >
        <div
          className={
            typeof Storage !== "undefined" &&             localStorage.getItem("nightMode") === "true"
              ? "mainBody darkMainBodyBG"
              : "mainBody mainBodyBG"
          }
          style={{ width: "100%", height: "100%" }}
        >
          {noItemsUI}
          <div className="itemsList" key="visibleTilesContainer">
            {visibleTiles}
          </div>
          {hiddenTilesUI}
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
        myRole
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
        values {
          id
          permission
          visibility
          valueDetails
          tileSize
          customName
          updatedAt
          createdAt
          device {
            id
          }
          myRole
          owner {
            id
            email
            fullName
            profileIconColor
          }
          ... on FloatValue {
            floatValue: value
            precision
            boundaries
          }
          ... on StringValue {
            stringValue: value
            maxChars
            allowedValues
          }
          ... on BooleanValue {
            boolValue: value
          }
          ... on ColourValue {
            colourValue: value
            allowedValues
          }
          ... on PlotValue {
            plotValue: value {
              id
              value
              timestamp
            }
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
