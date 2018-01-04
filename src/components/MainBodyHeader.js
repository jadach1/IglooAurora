import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ActionGrade from "material-ui/svg-icons/action/grade"
import ActionHistory from "material-ui/svg-icons/action/history"
import AppBar from "material-ui/AppBar/AppBar"

class MainBodyHeader extends Component {
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
      <AppBar
        className="sidebarHeader"
        zDepth={1}
        rounded={false}
        showMenuIconButton={false}
      >
        <div className="mainBodyHeader">
          {device.icon ? (
            <img
              className="deviceIconBig"
              src={device.icon}
              alt="device logo"
            />
          ) : (
            <ActionGrade />
          )}
          {device.customName}
          <div className="rightSide">
            <ActionHistory />
          </div>
        </div>
      </AppBar>
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
