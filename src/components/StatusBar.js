import React, { Component } from "react"
import Icon from "material-ui-next/Icon"
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
      userData: { user },
    } = this.props

    let deviceStatus = ""
    let signalStatus = ""

    if (
      user &&
      user.devices.filter(device => device.id === this.props.deviceId)[0]
    ) {
      if (
        user.devices.filter(device => device.id === this.props.deviceId)[0]
          .online ||
        user.devices.filter(device => device.id === this.props.deviceId)[0]
          .lastSeen
      ) {
        deviceStatus = user.devices.filter(
          device => device.id === this.props.deviceId
        )[0].online
          ? "Online"
          : "Last seen: " +
            user.devices.filter(device => device.id === this.props.deviceId)[0]
              .lastSeen
      }

      signalStatus = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].signalStatus
    }

    return (
      <div
        style={
          this.props.nightMode
            ? { background: "#2f333d", color: "white", height: "32px" }
            : { background: "white", color: "black", height: "32px" }
        }
        className="notSelectable statusBar defaultCursor"
      >
        <div style={{ marginLeft: "16px", lineHeight: "26px" }}>
          {deviceStatus}
          <div
            style={{
              float: "right",
              marginRight: "8px",
            }}
          >
            {signalStatus ? (
              <Icon>{"network_wifi_" + Math.floor(signalStatus / 20)}</Icon>
            ) : (
              ""
            )}
            <Icon>battery_full</Icon>
          </div>
        </div>
      </div>
    )
  }
}
