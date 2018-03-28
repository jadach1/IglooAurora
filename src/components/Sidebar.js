import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { List, ListItem } from "material-ui/List"
import CenteredSpinner from "./CenteredSpinner"
import FloatingActionButton from "material-ui/FloatingActionButton"
import Tooltip from "material-ui-next/Tooltip"

class Sidebar extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
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

    const updateQuery = gql`
      subscription {
        deviceUpdated {
          id
          customName
          icon
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
      document: updateQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevice = subscriptionData.deviceUpdated
        const newDevices = prev.user.devices.map(
          device => (device.id === newDevice.id ? newDevice : device)
        )
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })
  }

  listItemClick = device => {
    if (this.props.selectedDevice !== device.id) {
      this.props.selectDevice(device.id)
    } else {
      this.props.selectDevice(null)
    }
  }

  render() {
    const { userData: { loading, error, user } } = this.props

    if (loading) {
      return <CenteredSpinner />
    }
    if (error) {
      return <p>{error.message}</p>
    }

    return (
      <React.Fragment>
        <div style={{ height: "100%" }}>
          <List>
            {user.devices.map(device => (
              <ListItem
                className="notSelectable"
                primaryText={device.customName}
                /*                 secondaryText={
                  device.notifications
                    .map(notification => notification.content)
                    .reverse()[0]
                } */
                style={
                  this.props.selectedDevice === device.id
                    ? { backgroundColor: "#d4d4d4" }
                    : { backgroundColor: "transparent" }
                }
                leftIcon={
                  device.icon ? (
                    <img
                      className="deviceIcon"
                      src={device.icon}
                      alt="device logo"
                    />
                  ) : (
                    <i className="material-icons">lightbulb_outline</i>
                  )
                }
                key={device.id}
                onClick={() => this.listItemClick(device)}
              />
            ))}
          </List>
        </div>
        <Tooltip id="tooltip-bottom" title="Edit list" placement="bottom">
          <FloatingActionButton
            className="notSelectable deviceEditFab"
            backgroundColor="#ff4081"
            style={{
              transition:
                "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0s linear, right 0s linear, top 0s linear, bottom 0s linear",
            }}
          >
            <i className="material-icons">mode_edit</i>
          </FloatingActionButton>
        </Tooltip>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        devices {
          id
          customName
          icon
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
)(Sidebar)
