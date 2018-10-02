import React, { Component } from "react"
import Tile from "./tiles/Tile"
import LargeCenteredSpinner from "./LargeCenteredSpinner"
import FlatButton from "material-ui/FlatButton"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Icon from "material-ui-next/Icon"

class MainBody extends Component {
  componentDidMount() {
    const subscribeToNewValues = gql`
      subscription {
        valueCreated {
          id
          permission
          relevance
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
          permission
          relevance
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
          }
          ... on PlotValue {
            plotValue: value {
              id
              timestamp
              value
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
            this.props.nightMode
              ? { background: "#2f333d", height: "100%" }
              : { background: "white", height: "100%" }
          }
        >
          <div
            className={
              this.props.nightMode
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
            this.props.nightMode
              ? "mainBody darkMainBodyBG"
              : "mainBody mainBodyBG"
          }
        >
          An unexpected error occurred
        </div>
      )
    }

    const values = device.values
    let visibleTiles = values.filter(value => value.relevance === "VISIBLE")

    let hiddenTiles = values.filter(value => value.relevance === "HIDDEN")

    const renderTile = value => (
      <Tile
        value={value}
        key={value.id}
        nightMode={this.props.nightMode}
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
              ? this.props.nightMode
                ? { backgroundColor: "#282c34", color: "white" }
                : { backgroundColor: "#d4d4d4", color: "black" }
              : this.props.nightMode
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
          this.props.nightMode
            ? { background: "#2f333d", height: "calc(100vh - 96px)" }
            : { background: "white", height: "calc(100vh - 96px)" }
        }
      >
        <div
          className={
            this.props.nightMode
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
          displayName
          profileIconColor
        }
        admins {
          id
          email
          displayName
          profileIconColor
        }
        editors {
          id
          email
          displayName
          profileIconColor
        }
        spectators {
          id
          email
          displayName
          profileIconColor
        }
        values {
          id
          permission
          relevance
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
  `,
  {
    name: "deviceData",
    options: ({ deviceId }) => ({ variables: { id: deviceId } }),
  }
)(MainBody)
