import React, { Component } from "react"
import Icon from "material-ui-next/Icon"
import gql from "graphql-tag"
import moment from "moment"

export default class StatusBar extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceUpdated {
          id
          board {
            id
          }
          values {
            id
          }
          customName
          icon
          updatedAt
          createdAt
          myRole
          quietMode
          firmware
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
    let batteryCharging = ""

    if (
      user &&
      user.devices.filter(device => device.id === this.props.deviceId)[0]
    ) {
      deviceStatus = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].online
        ? "Online"
        : "Last seen " +
          moment
            .utc(
              user.devices.filter(
                device => device.id === this.props.deviceId
              )[0].updatedAt
            )
            .fromNow()

      signalStatus = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].signalStatus

      batteryCharging = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].batteryCharging
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
            {batteryCharging ? (
              <Icon>battery_charging_full</Icon>
            ) : (
              <Icon>battery_full</Icon>
            )}
          </div>
        </div>
      </div>
    )
  }
}
