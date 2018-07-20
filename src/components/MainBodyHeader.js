import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui-next/IconButton"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Tooltip from "material-ui-next/Tooltip"
import NotificationsDrawer from "./NotificationsDrawer"
import Icon from "material-ui-next/Icon"
import DeviceInfo from "./DeviceInfo"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const actions = [<Button onClick={this.handleClose}>Close</Button>]

    const { loading, error, device } = this.props.data

    if (loading) {
      return <div className="mainBodyHeader" />
    }

    if (error) {
      console.error(error)
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div
          className="mainBodyHeader notSelectable"
          style={{
            color: "white",
            height: "64px",
          }}
        >
          {device.icon ? (
            <img
              className="deviceIconBig"
              src={device.icon}
              alt="device logo"
            />
          ) : (
            <i
              className="deviceIconBig material-icons"
              style={{ cursor: "default" }}
            >
              lightbulb_outline
            </i>
          )}
          <p className="title" style={{ cursor: "default" }}>
            {device.customName}
          </p>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              gridArea: "buttons",
            }}
          >
            <Tooltip
              id="tooltip-bottom"
              title="See on the map"
              placement="bottom"
            >
              <IconButton
                style={{
                  color: "white",
                }}
              >
                <Icon>place</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-bottom"
              title="Device information"
              placement="bottom"
            >
              <IconButton
                onClick={() => this.setState({ infoOpen: true })}
                style={{
                  color: "white",
                }}
              >
                <Icon>info</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-bottom"
              title="Rearrange cards"
              placement="bottom"
            >
              <IconButton
                onClick={this.handleOpen}
                style={{
                  color: "white",
                }}
              >
                <Icon>mode_edit</Icon>
              </IconButton>
            </Tooltip>
            <NotificationsDrawer
              device={device}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={this.props.nightMode}
            />
          </div>
        </div>
        <Dialog
          title="Rearrange cards"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className="notSelectable"
        >
          [FILL WITH DRAG 'N' DROPPABLE LIST]
        </Dialog>
        <DeviceInfo
          infoOpen={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          id={device.id}
          updatedAt={device.updatedAt}
          createdAt={device.createdAt}
          devMode={this.props.devMode}
        />
      </React.Fragment>
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
        updatedAt
        createdAt
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
