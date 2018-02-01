import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { List, ListItem } from "material-ui/List"
import CenteredSpinner from "./CenteredSpinner"
import FloatingActionButton from "material-ui/FloatingActionButton"

class Sidebar extends Component {
  state = { selectedItem: null }

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

  listItemClick = device => {
    if (this.state.selectedItem != device.id) {
      this.props.selectDevice(device.id)

      this.setState({ selectedItem: device.id })
    } else {
      this.props.selectDevice(null)
      this.setState({ selectedItem: null })
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
                style={
                  this.state.selectedItem === device.id
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
        <FloatingActionButton
          className="notSelectable deviceEditFab"
          backgroundColor="#ff4081"
          style={{ transition: "left 0s linear" }}
        >
          <i className="material-icons">mode_edit</i>
        </FloatingActionButton>
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
        }
      }
    }
  `,
  { name: "userData" }
)(Sidebar)
