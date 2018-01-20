import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { List, ListItem } from "material-ui/List"
import CenteredSpinner from "./CenteredSpinner"
import FloatingActionButton from "material-ui/FloatingActionButton"

class Sidebar extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        console.log(prev)
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
    const { userData: { loading, error, user } } = this.props

    if (loading) {
      return <CenteredSpinner />
    }
    if (error) {
      return <p>{error.message}</p>
    }

    return (
      <div style={{ height: "100%" }}>
        <List>
          {user.devices.map(device => (
            <ListItem
              className="notSelectable"
              primaryText={device.customName}
              leftIcon={
                device.icon ? (
                  <img
                    className="deviceIcon"
                    src={device.icon}
                    alt="device logo"
                  />
                ) : (
                  <i class="material-icons">lightbulb_outline</i>
                )
              }
              key={device.id}
              onClick={() => this.props.selectDevice(device.id)}
            />
          ))}
        </List>
        <FloatingActionButton
          className="notSelectable"
          backgroundColor="#ff4081 "
          style={{
            position: "absolute",
            bottom: "20px",
          }}
        >
          <i className="material-icons">mode_edit</i>{" "}
        </FloatingActionButton>
      </div>
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
        }
      }
    }
  `,
  { name: "userData" }
)(Sidebar)
