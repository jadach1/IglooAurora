import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui/IconButton"

class MainBodyHeader extends Component {
  state = { open: false }

  openDrawer = () => this.setState({ open: true })

  handleClose = () => this.setState({ open: false })

  render() {
    const { loading, error, device } = this.props.data
    if (loading) {
      return <div className="mainBodyHeader" />
    }

    if (error) {
      console.error(error)
      return <div className="mainBodyHeader" />
    }

    return (
      <div className="mainBodyHeader notSelectable">
        {device.icon ? (
          <img className="deviceIconBig" src={device.icon} alt="device logo" />
        ) : (
          <i class="material-icons">lightbulb_outline</i>
        )}
        {device.customName}
      </div>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        customName
        icon
      }
    }
  `,
  {
    options: ({ deviceId }) => ({
      variables: {
        id: deviceId,
      },
    }),
  }
)(MainBodyHeader)
