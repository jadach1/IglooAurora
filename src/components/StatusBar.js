import React, { Component } from "react"
import AppBar from "material-ui-next/AppBar"
import Icon from "material-ui-next/Icon"
import CenteredSpinner from "./CenteredSpinner"
import gql from "graphql-tag"

export default class StatusBar extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceUpdated {
          id
          customName
          icon
          online
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

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceStatus = null

    if (error) deviceStatus = "Unexpected error"

    if (loading) deviceStatus = <CenteredSpinner />

    if (user) {
      deviceStatus = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].online
        ? "Online"
        : "Last seen:"
    }

    return (
      <div style={{ cursor: "default" }} className="notSelectable statusBar">
        {deviceStatus}
        <div style={{ float: "right" }}>
          <Icon>network_wifi</Icon>
          <Icon>battery_full</Icon>
          97%
        </div>
      </div>
    )
  }
}
