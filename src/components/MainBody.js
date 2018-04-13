import React, { Component } from "react"
import Tile from "./tiles/Tile"
import LargeCenteredSpinner from "./LargeCenteredSpinner"
import FlatButton from "material-ui/FlatButton"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { hotkeys } from "react-keyboard-shortcuts"

class MainBody extends Component {
  constructor() {
    super()
    this.state = {
      showHidden: false,
    }
  }

  hot_keys = {
    "alt+s": {
      priority: 1,
      handler: event => {
        this.setState(oldState => ({
          showHidden: !oldState.showHidden,
        }))
      },
    },
  }

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
          }
          ... on BooleanValue {
            boolValue: value
          }
          ... on ColourValue {
            colourValue: value
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
          }
          ... on BooleanValue {
            boolValue: value
          }
          ... on ColourValue {
            colourValue: value
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
        <div className="mainBody">
          <LargeCenteredSpinner />
        </div>
      )
    }
    if (error) {
      return <div className="mainBody">An unexpected error occurred</div>
    }

    const values = device.values
    let visibleTiles = values.filter(value => value.relevance === "VISIBLE")

    let hiddenTiles = values.filter(value => value.relevance === "HIDDEN")

    const renderTile = value => <Tile value={value} key={value.id} />

    visibleTiles = visibleTiles.map(renderTile)
    hiddenTiles = hiddenTiles.map(renderTile)

    let hiddenTilesUI = ""

    if (hiddenTiles.length !== 0) {
      hiddenTilesUI = [
        <FlatButton
          onClick={() =>
            this.setState(oldState => ({
              showHidden: !oldState.showHidden,
            }))
          }
          label={this.state.showHidden ? "Show less" : "Show more"}
          icon={
            this.state.showHidden ? (
              <i className="material-icons">keyboard_arrow_up</i>
            ) : (
              <i className="material-icons">keyboard_arrow_down</i>
            )
          }
          fullWidth={true}
          className="divider"
          key="showMoreLessButton"
          style={
            this.state.showHidden
              ? { backgroundColor: "#d4d4d4" }
              : { backgroundColor: "transparent" }
          }
        />,
        <div className="itemsList hiddenItems" key="hiddenTilesContainer">
          {this.state.showHidden ? hiddenTiles : ""}
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
            marginTop: "15px",
          }}
          key="noTilesUI"
          className="notSelectable"
        >
          This device has no values
        </div>
      )
    }

    return (
      <div className="mainBody">
        {noItemsUI}
        <div className="itemsList" key="visibleTilesContainer">
          {visibleTiles}
        </div>
        {hiddenTilesUI}
      </div>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        values {
          id
          permission
          relevance
          valueDetails
          tileSize
          customName
          ... on FloatValue {
            floatValue: value
            precision
            boundaries
          }
          ... on StringValue {
            stringValue: value
            maxChars
          }
          ... on BooleanValue {
            boolValue: value
          }
          ... on ColourValue {
            colourValue: value
          }
        }
      }
    }
  `,
  {
    name: "deviceData",
    options: ({ deviceId }) => ({ variables: { id: deviceId } }),
  }
)(hotkeys(MainBody))
